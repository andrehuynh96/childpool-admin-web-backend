const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger");
const { getToken } = require("./token")

module.exports = {
  set: async (symbol, payload) => {
    try {
      let accessToken = await getToken();
      let result = await axios.post(`${config.stakingApi.url}/accountcontribution/${symbol}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });

      return result.data;
    }
    catch (err) {
      logger.error("get account contribution fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  },
  get: async (symbol, limit, offset) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/accountcontribution/${symbol}?limit=${limit}&offset=${offset}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return result.data;
    }
    catch (err) {
      logger.error("get account contribution fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  }
}