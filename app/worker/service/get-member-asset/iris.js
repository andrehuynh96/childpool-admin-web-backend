const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');

class IRIS extends GetMemberAsset {
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

module.exports = IRIS;
