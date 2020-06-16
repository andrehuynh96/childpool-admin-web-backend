const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();
const { getToken } = require("./token")

module.exports = {
  getAllApiKey: async (partner_id, limit, offset) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/partners/${partner_id}/keys/?limit=${limit}&offset=${offset}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });
      return result.data;
    }
    catch (err) {
      logger.error("get list API key fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  },
  createApiKey: async (partner_id, name) => {
    try {
      let accessToken = await getToken();
      let result = await axios.post(`${config.stakingApi.url}/partners/${partner_id}/keys`,
        {
          name: name
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });

      return result.data;
    }
    catch (err) {
      logger.error("create new API key fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  },
  getPartner: async () => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });
      return result.data;
    }
    catch (err) {
      logger.error("get partner info fail:", err);
      return err.response ? { code: err.response.status, data: err.response.data } : null;
    }
  }
} 