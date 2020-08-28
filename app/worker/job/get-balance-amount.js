const logger = require("app/lib/logger");
const GetBalanceAmountAddress = require("../service/get-balance-amount/index");

module.exports = {
  execute: async () => {
    try {
      let service = new GetBalanceAmountAddress();
      service.get();
    }
    catch (err) {
      logger.error("get balance and amount job error:", err);
    }
  }
}