const GetMemberAsset = require("./base");
const logger = require('app/logger');

class ADA extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address) {
    try {

    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}

module.exports = ADA;