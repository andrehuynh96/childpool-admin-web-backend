const logger = require("app/lib/logger");
const config = require("app/config");
const StakingAPI = require("app/lib/staking-api/partner-tx-memo")
const User = require("app/model/wallet").users;

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let items = await StakingAPI.getAll(req.params.partner_id, limit, offset);
      if (!items.code) {
        let getUserNames = await _getUsername(items.data.items)
        return res.ok({ ...items.data, items: getUserNames && getUserNames.length > 0 ? getUserNames : [] });
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("get partner transaction memo fail:", err);
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      let items = await StakingAPI.create(req.params.partner_id, req.body.items, req.user.id)
      if (!items.code) {
        return res.ok(items.data);
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("create partner tx memo fail:", err);
      next(err);
    }
  },
  getHis: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let items = await StakingAPI.getHis(req.params.partner_id, limit, offset);
      if (!items.code) {
        let getUserNames = await _getUsername(items.data.items)
        return res.ok({ ...items.data, items: getUserNames && getUserNames.length > 0 ? getUserNames : [] });
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("get partner transaction memo history fail:", err);
      next(err);
    }
  }
}
const _getUsername = async (arr) => {
  if (!arr || arr.length == 0) {
    return arr;
  }
  let userNames = await User.findAll({
    attributes: [
      "id", "name"
    ],
    where: {
      id: arr.map(ele => ele.updated_by)
    }
  });
  let names = userNames.reduce((result, item) => {
    result[item.id] = item.name;
    return result;
  }, {});
  return arr.map(ele => {
    return {
      ...ele,
      updated_by_user_name: ele.partner_updated_by ? names[ele.updated_by] : null
    };
  })
}
