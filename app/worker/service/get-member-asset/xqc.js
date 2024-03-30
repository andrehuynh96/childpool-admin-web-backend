const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const config = require('app/config');
const axios = require('axios');
const https = require('https');
const BigNumber = require('bignumber.js');
const dbLogger = require('app/lib/logger/db');
const logHangout = require("app/lib/logger/hangout");
const DECIMAL = 8;
class XQC extends GetMemberAsset {
  constructor() {
    super();
  }

  async get(address) {
    try {
      let balance = 0;
      let amount = 0;
      let reward = 0;
      const apiUrl = config.XQC.url;
      const Api = axios.create({
        baseURL: apiUrl,
        timeout: 20000,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      let res = await Api.get(`/address/balance/${address}`);
      if (res.data.data) {
        const assets = res.data.data.balance && res.data.data.balance.assets ? res.data.data.balance.assets : null;
        balance = assets && assets.XQC ? BigNumber(assets.XQC.balance).multipliedBy(10 ** DECIMAL).toNumber() : 0;
      }
      return {
        balance: balance,
        amount: amount,
        reward: reward,
      };
    }
    catch (error) {
      await dbLogger(error,address);
      logHangout.write(JSON.stringify(error));
      logger.error(error);
      return null;
    }
  }
}

module.exports = XQC;
