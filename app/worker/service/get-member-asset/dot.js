const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const config = require('app/config');
const BigNumber = require('bignumber.js');
const dbLogger = require('app/lib/logger/db');
const logHangout = require("app/lib/logger/hangout");
const axios = require('axios');

const DECIMAL = config.DOT.isMainnet ? 10 : 12;
class DOT extends GetMemberAsset {
  constructor() {
    super();
  }

  async get(address) {
    try {
      let balance = 0;
      let amount = 0;
      let reward = 0;
      const dotUrl = config.DOT.url;
      const balanceParams = {
        key: address,
        row: 1,
        page: 0
      };
      const result = await axios.post(`${dotUrl}/search`,balanceParams);
      if (result.data.data) {
        const account = result.data.data.account;
        const availableBalance = account.balance ? BigNumber(account.balance).multipliedBy(10 ** DECIMAL).toNumber() : 0;
        const lockBalance = account.balance_lock ? BigNumber(account.balance_lock).multipliedBy(10 ** DECIMAL).toNumber() : 0;
        balance = lockBalance ? availableBalance - lockBalance : availableBalance;
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

module.exports = DOT;
