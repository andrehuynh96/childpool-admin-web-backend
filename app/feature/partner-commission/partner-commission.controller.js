const logger = require("app/lib/logger");
const config = require("app/config");
const StakingAPI = require("app/lib/staking-api/partner-commission");
const User = require("app/model/wallet").users;
const mapper = require("app/feature/response-schema/partner-commission.response-schema");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let items = await StakingAPI.getAllCommission(req.params.partner_id, limit, offset);
      if (!items.code) {
        return res.ok({ ...items.data, items: mapper(await _getUsername(items.data.items)) });
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("get list partner commission fail:", err);
      next(err);
    }
  },
  getHis: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let items = await StakingAPI.getCommissionHis(req.params.partner_id, limit, offset);
      if (!items.code) {
        return res.ok({ ...items.data, items: mapper(await _getUsername(items.data.items)) });
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("create partner commission history fail:", err);
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      let items = await StakingAPI.updateCommission(req.params.partner_id, req.body.items, req.user.id);
      if (!items.code) {
        return res.ok(mapper(await _getUsername(items.data)));
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("update partner commission fail:", err);
      next(err);
    }
  },
  getAllByPlatform: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let items = await StakingAPI.getAllCommissionByPlatform(req.params.platform, limit, offset);
      if (!items.code) {
        return res.ok({ ...items.data, items: mapper(await _getUsername(items.data.items)) });
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("get list partner commission by platform fail:", err);
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      let items = await StakingAPI.getCommissions(req.params.partner_id, req.params.platform);
      if (!items.code) {
        return res.ok(mapper(await _getUsername(items.data)));
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("get list partner commission fail:", err);
      next(err);
    }
  },
  getAllByPartner: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let items = await StakingAPI.getAllCommissionByPartner(limit, offset);
      if (!items.code) {
        return res.ok({ ...items.data, items: mapper(await _getUsername(items.data.items)) });
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("get list partner commission by partner fail:", err);
      next(err);
    }
  },
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