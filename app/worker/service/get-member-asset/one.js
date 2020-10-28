const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const config = require('app/config');
const BigNumber = require('bignumber.js');
const StakingPlatform = require('app/lib/staking-api/staking-platform');
const MemberAsset = require('app/model/wallet').member_assets;
const axios = require('axios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const logHangout = require("app/lib/logger/hangout");
const dbLogger = require('app/lib/logger/db');
class ONE extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address) {
    try {
      const balance = await getBalanceONE(address);
      const validatorAddresses = await StakingPlatform.getValidatorAddresses('ONE');
      const { amount, reward, unclaimReward } = await getAmountAndRewardONE(address, validatorAddresses);

            return {
                balance: balance,
                amount: amount,
                reward: reward,
                unclaimReward: unclaimReward
            };
        } catch (error) {
          await dbLogger(error,address);
            logger.error(error);
            return null;
        }
    }
  }
}

async function getBalanceONE(address) {
  let balance = 0;
  const shards = Object.values(config.harmony);
  for (let item of shards) {
    if (item != null) {
      const data = {
        jsonrpc: '2.0',
        method: 'hmyv2_getBalance',
        params: [address],
        id: 1
      }
      let options = {
        method: 'POST',
        url: item,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
      };
      const response = await axios(options);
      const numBalance = BigNumber(response.data.result).toNumber();
      balance += numBalance;
    }
  }
  return balance;
}

async function getAmountAndRewardONE(address, validatorAddresses) {
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
    let unclaimReward = 0;
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    const { result } = response.data;

    result.forEach(item => {
      if (validatorAddresses.indexOf(item.validator_address) != -1) {
        amount += BigNumber(item.amount).toNumber();
        unclaimReward += BigNumber(item.reward).toNumber();
      }
    });

    let memberAsset = await MemberAsset.findOne({
      where: {
        platform: 'ONE',
        address: address,
        missed_daily: false,
        created_at: { [Op.lt]: date }
      },
      order: [
        ['created_at', 'DESC']
      ]
    });

    const totalAmount = BigNumber(amount).toNumber();
    const totalUnclaimRewad = BigNumber(unclaimReward).toNumber();

    if (memberAsset) {
      let number = 0;
      let claim = 0;
      let fromSecondEpoch = Date.parse(memberAsset.updatedAt) / 1000;
      let colectRewardHashes = await getCollectRewardTxsHash(address, fromSecondEpoch);

      if (colectRewardHashes && colectRewardHashes.length > 0) {
        for (let txHash of colectRewardHashes) {
          var txReceipt = await getTransactionReceipt(txHash);
          if (txReceipt && txReceipt.status && txReceipt.logs) {
            var claimAmountHex = txReceipt.logs[0].data;
            claim += parseInt(claimAmountHex, 16);
          }
        }
      }
      number = totalUnclaimRewad + claim - BigNumber(memberAsset.unclaim_reward).toNumber();
      reward = number > 0 ? number : 0;
    } else {
      reward = totalUnclaimRewad;
    }

        return {
            amount: totalAmount,
            reward: reward,
            unclaimReward: totalUnclaimRewad
        };
    } catch (error) {
        await dbLogger(error,address);
        logger.error(error);
        return null;
    }
}

async function getCollectRewardTxsHash(address, fromSecondEpoch) {
  try {
    const data = {
      jsonrpc: '2.0',
      method: 'hmyv2_getStakingTransactionsHistory',
      params: [{
        "address": address,
        "pageIndex": 0,
        "pageSize": 500,
        "fullTx": true,
        "txType": "SENT",
        "order": "DESC"
      }],
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

    const { result } = response.data;
    var txHashes = [];
    if (result && result.staking_transactions && result.staking_transactions.length > 0) {
      let txs = result.staking_transactions;
      for (let idx = 0; idx < txs.length; idx++) {
        let tx = txs[idx];
        if (tx.timestamp >= fromSecondEpoch) {
          if (tx.type == 'CollectRewards') {
            txHashes.push(tx.hash);
          }
        } else {
          break;
        }
      }
    }

    return txHashes;
  } catch (err) {
    logHangout.write(JSON.stringify(err));
        await dbLogger(err);
        logger.error(err)
        return null
}

async function getTransactionReceipt(txHash) {
  try {
    const data = {
      jsonrpc: '2.0',
      method: 'hmyv2_getTransactionReceipt',
      params: [txHash],
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

        const { result } = response.data;
        return result;
    } catch (err) {
        await dbLogger(err);
        logger.error(err)
        return null
    }
}

module.exports = ONE;
