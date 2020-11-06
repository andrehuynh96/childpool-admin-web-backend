const logger = require("app/lib/logger");
const CheckStatusFiatTransaction = require("../service/check-status-fiat-transaction/index");

module.exports = {
  execute: async () => {
    try {
      let service = new CheckStatusFiatTransaction();
      service.check();
    }
    catch (err) {
      logger.error("check status fiat transaction job error:", err);
    }
  }
}