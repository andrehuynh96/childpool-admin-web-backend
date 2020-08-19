const logger = require("app/lib/logger");
const CheckAdaPoolSize = require("../service/check-ada-pool-size/index");

module.exports = {
  execute: async () => {
    try {
      let service = new CheckAdaPoolSize();
      service.check();
    }
    catch (err) {
      logger.error("check ada pool size job error:", err);
    }
  }
}