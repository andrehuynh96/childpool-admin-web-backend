const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger");
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();
const queryString = require('query-string');

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

  async updateClaimRequests(claimRewardIds, status) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.put(`${API_URL}/claim-rewards`,
        {
          id_list: claimRewardIds,
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

  async createPolicy(data) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.post(`${API_URL}/policies`,
        data,
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("create membership policy fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getPolicyDetail(policyId) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.get(`${API_URL}/policies/${policyId}`,
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("get membership policy detail fail:", err);

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

  async searchCaculateRewardRequest(query) {
    try {
      let limit = query.limit ? parseInt(query.limit) : 10;
      let offset = query.offset ? parseInt(query.offset) : 0;

      const data = {
        limit: limit,
        offset: offset
      };

      if (query.from_date) data.from_date = query.from_date;
      if (query.to_date) data.to_date = query.to_date;
      if (query.currency) data.currency = query.currency;
      if (query.status) data.status = query.status;

      const queryData = queryString.stringify(data);
      const headers = await this.getHeaders();
      const result = await axios.get(`${API_URL}/affiliate-requests?${queryData}`,
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("get caculate reward request list fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getCaculateRewardRequestDetail(requestId) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.get(`${API_URL}/affiliate-requests/${requestId}`,
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("get caculate reward request detail fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getCaculateRewardRequestDetailList(requestId, limit, offset) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.get(`${API_URL}/affiliate-requests/${requestId}/details/?limit=${limit}&offset=${offset}`,
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("get caculate reward request detail list fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getTreeChart(memberEmail) {
    try {
      const headers = await this.getHeaders();
      const queryData = queryString.stringify({ ext_client_id: memberEmail });
      const result = await axios.get(`${API_URL}/clients/tree-chart?${queryData}`,
        {
          headers,
        });
      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("get member tree chart fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async getMemberReferralStructure(ext_client_id) {
    try {
      const headers = await this.getHeaders();
      const queryData = queryString.stringify({ ext_client_id: ext_client_id });
      const result = await axios.get(`${API_URL}/clients/referral-structure?${queryData}`,
        {
          headers,
        });
      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("get membership referral structure fail:", err);
    }
  }
  async setRewardRequest(payload) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.post(`${API_URL}/rewards`,
        payload,
        {
          headers,
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("setRewardRequest:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  }

  async updateMembershipTypeConfig(data) {
    try {
      const headers = await this.getHeaders();
      const result = await axios.put(`${API_URL}/membership-type-config`,
        { membershipTypes: data },
        {
          headers,
        });
      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("get membership referral structure fail:", err);

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

  async registerMembership({
    email,
    referrerCode,
    membershipOrder,
    membershipType,
  }) {
    try {


      const headers = await this.getHeaders();
      const data = {
        ext_client_id: email,
        affiliate_code: referrerCode || "",
        membership_order_id: membershipOrder.id.toString(),
        membership_type_id: membershipType.id,
        amount: Number(membershipOrder.amount_usd),
        currency_symbol: "USDT",
      };
      const result = await axios.post(`${API_URL}/membership-clients`,
        data,
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
          membership_type_id: membershipType.id,
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