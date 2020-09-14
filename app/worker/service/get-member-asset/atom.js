const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');

class ATOM extends GetMemberAsset {
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
module.exports = ATOM;
