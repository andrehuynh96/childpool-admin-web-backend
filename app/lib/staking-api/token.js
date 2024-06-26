const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger");
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();

module.exports = {
  getToken: async () => {
    let token = null;
    if (cache)
      token = await cache.getAsync(redisResource.stakingApi.token);
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

    if (cache) {
      await cache.setAsync(redisResource.stakingApi.token, result.data.data.access_token, "EX", 3600);
    }

    return result.data.data.access_token;
  }
};
