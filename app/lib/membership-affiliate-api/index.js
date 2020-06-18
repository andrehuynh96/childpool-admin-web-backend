const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();

const API_URL = config.affiliate.url;

const membershipAffiliateApi = {
  register: async ({ email, referrerCode }) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.post(`${API_URL}/clients`,
        {
          ext_client_id: email,
          affiliate_code: referrerCode || ""
        },
        {
          headers: {
            "x-use-checksum": true,
            "x-secret": config.affiliate.secretKey,
            "Content-Type": "application/json",
            "x-affiliate-type-id": config.affiliate.membershipTypeId,
            Authorization: `Bearer ${accessToken}`,
          }
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  },
};


async function _getAccessToken() {
  const key = redisResource.affiliate.token;
  const token = await cache.getAsync(key);
  if (token) {
    return token;
  }

  const result = await axios.post(`${API_URL}/auth/token`, {
    api_key: config.affiliate.apiKey,
    secret_key: config.affiliate.secretKey,
    grant_type: "client_credentials"
  });

  const data = result.data.data;
  const accessToken = data.access_token;

  const expiredTime = Math.max(data.expires_in - 3, 1);
  await cache.setAsync(key, accessToken, "EX", expiredTime);

  return accessToken;
}

module.exports = membershipAffiliateApi;