const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const config = require('app/config');
const axios = require('axios');
const BigNumber = require('bignumber.js');
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
    let reward = 0;

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
