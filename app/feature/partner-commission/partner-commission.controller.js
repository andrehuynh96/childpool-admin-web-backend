const logger = require("app/lib/logger");
const config = require("app/config");
const StakingAPI = require("app/lib/staking-api/partner-commission");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let items = await StakingAPI.getAllCommission(req.params.partner_id, limit, offset);
      if (!items.code) {
        return res.ok(items.data);
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
        return res.ok(items.data);
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
        return res.ok(items.data);
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("update partner commission fail:", err);
      next(err);
    }
  }
}