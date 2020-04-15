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
      return { code: err.response.status, data: err.response.data };
    }
  },
  getAllGrandchild: async (limit, offset) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/grandchild/?limit=${limit}&offset=${offset}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });

      return result.data;
    }
    catch (err) {
      logger.error("getAllGrandchild fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  },
  updateGrandchild: async (id, name, userId) => {
    try {
      let accessToken = await getToken();
      let result = await axios.put(`${config.stakingApi.url}/grandchild/${id}`,
        {
          name,
          updated_by: userId
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
      logger.error("updateGrandchild fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  },
  getGrandchild: async (id) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/grandchild/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

      return result.data;
    }
    catch (err) {
      logger.error("getGrandchild fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  },
  revokeAPIKey: async (partnerId, apiKey) => {
    try {
      let accessToken = await getToken();
      let result = await axios.delete(`${config.stakingApi.url}/partners/${partnerId}/keys/${apiKey}`, {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });

      return result.data;
    }
    catch (err) {
      logger.error("revokeAPIKey fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  },
  createRewardAddressRequest: async (commissionId, body) => {
    try {
      let accessToken = await getToken();
      let result = await axios.post(`${config.stakingApi.url}/commissions/${commissionId}/requests`,
        {
          reward_address: body.reward_address,
          link: body.link,
          email_confirmed: body.email
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });

      return result.data;

    } catch (err) {
      logger.error("createRewardAddressRequest fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  },
  updateRewardAddressRequest: async (body) => {
    try {
      let accessToken = await getToken();
      let result = await axios.post(`${config.stakingApi.url}/commissions/requests`,
        {
          status: body.status,
          token: body.token
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });

      return result.data;

    } catch (err) {
      logger.error("updateRewardAddressRequest fail:", err);
      return { code: err.response.status, data: err.response.data };
    }
  }
} 