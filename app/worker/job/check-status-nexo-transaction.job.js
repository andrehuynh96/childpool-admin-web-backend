const logger = require("app/lib/logger");
const CheckStatusNexoTransaction = require("../service/check-status-nexo-transaction/index");

module.exports = {
  execute: async () => {
    try {
      let service = new CheckStatusNexoTransaction();
      service.check();
    }
    catch (err) {
      logger.error("check status fiat transaction job error:", err);
    }
  }
};
