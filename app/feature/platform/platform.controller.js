const logger = require("app/lib/logger");
const Platform = require("app/model/wallet/value-object/platform");

module.exports = {
  get: async (req, res, next) => {
    try {
      return res.ok(Object.values(Platform));
    }
    catch (err) {
      logger.error("get platform fail", err);
      next(err);
    }
  }
}