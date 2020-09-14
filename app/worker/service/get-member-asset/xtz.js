const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const config = require('app/config');
const axios = require('axios');
const BigNumber = require('bignumber.js');
const tezosReward = require('app/lib/staking-api/tezos-reward');
class XTZ extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address) {
    try {
      const network = config.tezos.tezosServerUrl;
    const getBalancePath = `${network}/chains/main/blocks/head/context/contracts/${address}/balance`;

    const balanceResult = await axios.get(getBalancePath);
    const balance = BigNumber(balanceResult.data).toNumber();
    let resultPayment = await tezosReward.getTezosReward(address);
    const reward = resultPayment.data.amount;
    return {
      balance: balance,
      amount: balance,
      reward: reward
    };
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}

module.exports = XTZ;
