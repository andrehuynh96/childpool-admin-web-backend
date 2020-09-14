const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const config = require('app/config');
const BigNumber = require('bignumber.js');
const InfinitoApi = require('node-infinito-api');

class IRIS extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address) {
    try {
      const api = new InfinitoApi(config.infinitoApiOpts);
      const apiCoin = api['IRIS'];
      let balance = 0;
      let amount = 0;
      let reward = 0;

      const balanceResult = await apiCoin.getBalance(address);
      if (balanceResult && balanceResult.data) {
        balance = balanceResult.data.balance;
      }

      const amountResult = await apiCoin.getListDelegationsOfDelegator(address);
      if (amountResult && amountResult.data.length > 0) {
        amountResult.data.forEach(item => {
          amount += BigNumber(item.shares).toNumber();
        });
      }

      const rewardResult = await apiCoin.getRewards(address);
      if (rewardResult && rewardResult.data.total.length > 0) {
        reward = BigNumber(rewardResult.data.total[0].amount).toNumber();
      }
      return {
        balance: balance,
        amount: amount,
        reward: reward
      };
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}

module.exports = IRIS;
