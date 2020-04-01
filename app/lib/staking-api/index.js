const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();
const { getToken } = require("./token")

module.exports = {
  createGrandchild: async (body) => {
    try {
      let accessToken = await getToken();
      let result = await axios.post(`${config.stakingApi.url}/grandchild`,
        {
          email: body.email,
          name: body.name,
          partner_type: body.partner_type,
          created_by: body.created_by
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
      logger.error("createGrandchild fail:", err);
      return err.response.data;
    }
  },
  getAllGrandchild: async () => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/grandchild`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });

      return result.data;
    }
    catch (err) {
      logger.error("getAllGrandchild fail:", err);
      return err.response.data;
    }
  },
  revokeAPIKey: async () => {
    try {
      let accessToken = await _getToken();
      let result = await axios.get(`${config.stakingApi.url}/api-key/revoke`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });

      return result.data;
    }
    catch (err) {
      logger.error("revokeAPIKey fail:", err);
      return err.response.data;
    }
  }
} 