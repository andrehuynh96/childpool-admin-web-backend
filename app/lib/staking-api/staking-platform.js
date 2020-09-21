const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const { getToken } = require("./token")

module.exports = {
  getValidatorAddresses: async (platform) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/platform-votes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });
      return result.data ? result.data.data.filter(e => e.symbol.toUpperCase() == platform.toUpperCase()).map(e => e.validator_address) : [];
    }
    catch (err) {
      logger.error("get list API key fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  }
} 