const GetMemberAsset = require("./base");
const axios = require('axios');
const logger = require('app/lib/logger');
const config = require('app/config');
const BigNumber = require('bignumber.js');
const { GovernanceTxBuilder, Crypto } = require('ontology-ts-sdk');
class ONT extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address) {
    try {
      const network = config.ONT.restUrl;
      let balance = 0;
      let amount = 0;
      let reward = 0;
      const getAsset = await axios.get(`${network}/api/v1/balance/${address}`);
      if (getAsset && getAsset.data) {
        balance = BigNumber(getAsset.data.Result.ont).toNumber();
      }
      else {
        return null;
      }

      // GET Staking Amount
      const userAddr = new Crypto.Address(address);
      const pk = config.ONT.validatorAddress;

      const authorizeInfo = await GovernanceTxBuilder.getAuthorizeInfo(pk, userAddr, network);
      if (authorizeInfo) {
        const { consensusPos, freezePos, newPos } = authorizeInfo;
        amount = consensusPos + freezePos + newPos;
      }
      else {
        return null;
      }

      // GET Reward
      const splitFee = await GovernanceTxBuilder.getSplitFeeAddress(userAddr, network);
      if (splitFee) {
        reward = BigNumber(splitFee.amount).toNumber();
      }
      else {
        return null;
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

module.exports = ONT;
