const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger");
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();
const MembershipTypeName = require("app/model/wallet/value-object/membership-type-name");

const API_URL = config.affiliate.url;

class AffiliateApi {

  constructor() {
    this.config = {
      ...config.affiliate,
      affiliateTypeId: config.affiliate.affiliateTypeId,
    };
  }

  async register({ email, referrerCode }) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.post(`${API_URL}/clients`,
        {
          ext_client_id: email,
          affiliate_code: referrerCode || ""
        },
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async updateReferrer({ email, referrerCode }) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.put(`${API_URL}/clients/affiliate-codes`,
        {
          ext_client_id: email,
          affiliate_code: referrerCode
        },
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getReferrals({ email, offset = 0, limit = 10 }) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.get(`${API_URL}/clients/invitees?ext_client_id=${email}&offset=${offset}&limit=${limit}`,
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("create client fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async updateClaimRequest(claimRewardId, status) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.put(`${API_URL}/claim-rewards/${claimRewardId}`,
        {
          status: status
        },
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("updateClaimRequest:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getAllPolicies(limit, offset) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.get(`${API_URL}/policies?limit=${limit}&offset=${offset}`,
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("get membership policy fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async updatePolicy(policyId, data) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.put(`${API_URL}/policies/${policyId}`,
        data,
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("update membership policy fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  }

// Private functions
async getHeaders() {
  const accessToken = await this.getAccessToken();
  const headers = {
    "x-use-checksum": true,
    "x-secret": this.config.secretKey,
    "Content-Type": "application/json",
    "x-affiliate-type-id": this.config.affiliateTypeId,
    Authorization: `Bearer ${accessToken}`,
  };

  return headers;
}

async getAccessToken() {
  const key = redisResource.affiliate.token;
  const token = await cache.getAsync(key);
  if (token) {
    return token;
  }

  const result = await axios.post(`${API_URL}/auth/token`, {
    api_key: this.config.apiKey,
    secret_key: this.config.secretKey,
    grant_type: "client_credentials"
  });

  const data = result.data.data;
  const accessToken = data.access_token;

  const expiredTime = Math.max(data.expires_in - 3, 1);
  await cache.setAsync(key, accessToken, "EX", expiredTime);

  return accessToken;
}

}
class MembershipApi extends AffiliateApi {

  constructor() {
    super();

    this.config = {
      ...config.affiliate,
      affiliateTypeId: config.affiliate.membershipTypeId,
    };
  }

  async registerMembership({ email, referrerCode, membershipTypeId }) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.post(`${API_URL}/clients`,
        {
          ext_client_id: email,
          affiliate_code: referrerCode || "",
          membership_type_id: membershipTypeId,
        },
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("registerMembership:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async updateMembershipType(email, membershipType) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.put(`${API_URL}/clients/membership-type`,
        {
          ext_client_id: email,
          membership_type_id: membershipType.type === MembershipTypeName.Free ? membershipType.id : null,
        },
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("Update Membership Type:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

}

const affiliateApi = new AffiliateApi();
const membershipApi = new MembershipApi();

module.exports = {
  affiliateApi,
  membershipApi,
};