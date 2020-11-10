const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger");
const { getToken } = require("./token");

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
      logger[err.canLogAxiosError ? 'error' : 'info']("get list API key fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  },
  getValidatorInfo: async (platform) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/validators-info/${platform}?status=all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });
      return result.data;
    }
    catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']("get list API key fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  }
};

