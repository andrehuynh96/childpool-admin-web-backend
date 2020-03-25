const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();

module.exports = {
    getAllApiKey:  async (partner_id,limit,offset) => {
        try {
          let accessToken = await _getToken();
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
          return err.response.data;
        }
      },
      createApiKey: async(partner_id,name) => {
        try {
          console.log("======================>",name)
          let accessToken = await _getToken();
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
          return err.response.data;
        }
      }
}
async function _getToken() {
    let token = await cache.getAsync(redisResource.stakingApi.token);
    if (token) {
      return token;
    }
    let result = await axios.post(
      `${config.stakingApi.url}/accounts/authentication`,
      {
        api_key: config.stakingApi.key,
        secret_key: config.stakingApi.secret,
        grant_type: "client_credentials"
      }
    );
  
    await cache.setAsync(redisResource.stakingApi.token, result.data.data.access_token, "EX", parseInt(result.data.data.expires_in) - 10);
    return result.data.data.access_token;
  }