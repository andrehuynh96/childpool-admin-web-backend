const logger = require("app/lib/logger");
const CheckTransactionDistributeReward = require("../service/check-distribute/index");

module.exports = {
  execute: async () => {
    try {
      let service = new CheckTransactionDistributeReward();
      service.check();
    }
    catch (err) {
      logger.error("check transaction distribute reward to member job error:", err);
    }
  }
}