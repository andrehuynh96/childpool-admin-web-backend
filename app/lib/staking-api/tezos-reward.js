const { getToken } = require("./token");
const axios = require("axios");
const config = require('app/config');
const logger = require("app/lib/logger");

module.exports = {
  getTezosReward: async (address) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/tezos-rewards/?address=${address}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return result.data;
    } catch (error) {
      logger[error.canLogAxiosError ? 'error' : 'info']("get tezos reward fail:", error);
      return { code: error.response.status, data: error.response.data };
    }
  }
};
