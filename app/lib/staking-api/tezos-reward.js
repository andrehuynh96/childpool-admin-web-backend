const { getToken } = require("./token");
const axios = require("axios");
const config = require('app/config');
const logger = require("app/lib/logger");

module.exports = {
  getTezosReward: async (address,date) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/tezos-rewards?address=${address}&date=${date}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return result.data;
    } catch (error) {
      logger.error("get tezos reward fail:", error);
      return { code: error.response.status, data: error.response.data };
    }
  }
};
