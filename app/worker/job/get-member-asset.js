const logger = require("app/lib/logger");
const GetMemberAssetAddress = require("../service/get-member-asset");

module.exports = {
  execute: async () => {
    try {
      let service = new GetMemberAssetAddress();
      await service.get();
    }
    catch (err) {
      logger.error("get balance and amount job error:", err);
    }
  }
};
