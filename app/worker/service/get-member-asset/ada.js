const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');

class ADA extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address) {
    try {
      let data;
      return data;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}

module.exports = ADA;
