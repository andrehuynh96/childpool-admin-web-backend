const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const axios = require('axios');
const config = require('app/config');
const BigNumber = require('bignumber.js');
class QTUM extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address) {
    try {
      const api = axios.create({
        baseURL: config.qtum.url,
        timeout: 2000
      });
      const result = await api.get(`/address/${address}`);
      const balance = BigNumber(result.data.balance).toNumber();
      const amount = BigNumber(result.data.mature).toNumber();
      return {
        balance: balance,
        amount: amount,
        reward: 0
      };
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}

module.exports = QTUM;
