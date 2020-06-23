const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();
const MembershipTypeName = require("app/model/wallet/value-object/membership-type-name");

const API_URL = config.affiliate.url;

const affiliateApi = {
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
            "x-affiliate-type-id": config.affiliate.affiliateTypeId,
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
  registerMembership: async ({ email, referrerCode, membershipTypeId }) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.post(`${API_URL}/clients`,
        {
          ext_client_id: email,
          affiliate_code: referrerCode || "",
          membership_type_id: membershipTypeId,
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
      logger.error("registerMembership:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  updateReferrer: async ({ email, referrerCode }) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.put(`${API_URL}/clients/affiliate-codes`,
        {
          ext_client_id: email,
          affiliate_code: referrerCode
        },
        {
          headers: {
            "x-use-checksum": true,
            "x-secret": config.affiliate.secretKey,
            "Content-Type": "application/json",
            "x-affiliate-type-id": config.affiliate.affiliateTypeId,
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
  getReferrals: async ({ email, offset = 0, limit = 10 }) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.get(`${API_URL}/clients/invitees?ext_client_id=${email}&offset=${offset}&limit=${limit}`,
        {
          headers: {
            "x-use-checksum": true,
            "x-secret": config.affiliate.secretKey,
            "Content-Type": "application/json",
            "x-affiliate-type-id": config.affiliate.affiliateTypeId,
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
  updateMembershipType: async (email, membershipType) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.put(`${API_URL}/clients/membership-type`,
        {
          ext_client_id: email,
          membership_type_id: membershipType.type === MembershipTypeName.Free ? membershipType.id : null,
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
      logger.error("Update Membership Type:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  updateClaimRequest: async (claimRewardId, status) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.put(`${API_URL}/claim-rewards/${claimRewardId}`,
        {
          status: status
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
      logger.error("updateClaimRequest:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  getAllPolicy: async () => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.get(`${API_URL}/policies`,
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
      logger.error("get membership policy fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  updatePolicy: async (policyId, data) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.put(`${API_URL}/policies/${policyId}`,
        data,
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
      logger.error("update membership policy fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  getAllAffiliatePolicy: async (limit, offset) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.get(`${API_URL}/policies?limit=${limit}&offset=${offset}`,
        {
          headers: {
            "x-use-checksum": true,
            "x-secret": config.affiliate.secretKey,
            "Content-Type": "application/json",
            "x-affiliate-type-id": config.affiliate.affiliateTypeId,
            Authorization: `Bearer ${accessToken}`,
          }
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("get affiliate policy list fail:", err);

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

module.exports = affiliateApi;