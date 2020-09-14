const GetMemberAsset = require("./base");
const logger = require('app/logger');
const {
  ChainID,
  ChainType,
  hexToNumber,
  fromWei,
  Units,
} = require('@harmony-js/utils');
const config = require('app/config');
const { Harmony } = require('@harmony-js/core');
const BigNumber = require('bignumber.js');
class ONE extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address) {
    try {
      const balance = await getBalanceONE(address);
      const { amount, reward } = await getAmountAndRewardONE(address);
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

async function getBalanceONE(address) {
  let balance = 0;
  const shards = Object.values(config.harmony);
  for (let item of shards) {
    const hmy = new Harmony(
      item,
      {
        chainType: ChainType.Harmony,
        chainId: ChainID.HmyTestnet,
      });
    const response = await hmy.blockchain.getBalance({ address: address });
    const shardBalance = fromWei(hexToNumber(response.result), Units.one);
    const numBalance = BigNumber(shardBalance).toNumber();
    balance += numBalance;
  }
  return balance;
}

async function getAmountAndRewardONE(address) {
  try {
    const data = {
      jsonrpc: '2.0',
      method: 'hmy_getDelegationsByDelegator',
      params: [address],
      id: 1
    };
    let options = {
      method: 'POST',
      url: config.harmony.urlShard0,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data)
    };
    const response = await axios(options);
    let amount = 0;
    let reward = 0;
    const { result } = response.data;
    result.forEach(item => {
      amount += item.amount;
      reward += item.reward;
    });
    const totalAmount = BigNumber(amount).toNumber();
    return {
      amount: totalAmount,
      reward: reward
    };
  }
  catch (error) {
    logger.error(error);
    throw error;
  }
}
module.exports = ONE;
