const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const config = require('app/config');
const axios = require('axios');
const BigNumber = require('bignumber.js');
const tezosReward = require('app/lib/staking-api/tezos-reward');
const StakingPlatform = require('app/lib/staking-api/staking-platform');
class XTZ extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address,date) {
    try {
      if (!date) {
        date = new Date();
      }
      let network = config.tezos.tezosServerUrl;
      let path = `${network}/chains/main/blocks/head/context/contracts/${address}`;
      let validatorAddresses = await StakingPlatform.getValidatorAddresses('XTZ');
      let result = await axios.get(path);
      let balance = 0;
      let amount = 0;
      if (result.data) {
          balance = BigNumber(result.data.balance).toNumber();
          amount = result.data.delegate && validatorAddresses.indexOf(result.data.delegate) != -1 ? balance : 0;
      }
      let resultPayment = await tezosReward.getTezosReward(address,date);
      let reward = resultPayment.data ? resultPayment.data.amount : 0;
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

module.exports = XTZ;
