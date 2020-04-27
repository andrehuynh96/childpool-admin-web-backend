const logger = require("app/lib/logger");
const config = require("app/config");
const StakingAPI = require("app/lib/staking-api/partner-api-key")

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let items = await StakingAPI.getAllApiKey(req.params.id, limit, offset);
      if (!items.code) {
        return res.ok(items.data);
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("get list grandchild fail:", err);
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      let items = await StakingAPI.createApiKey(req.params.id, req.body.name)
      if (!items.code) {
        return res.ok(items.data);
      }
      else {
        return res.status(parseInt(items.code)).send(items.data);
      }
    }
    catch (err) {
      logger.error("create grandchild fail:", err);
      next(err);
    }
  },
}