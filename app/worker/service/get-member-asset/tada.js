require('dotenv').config();
require('rootpath')();
const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const axios = require('axios');
const config = require('app/config');
const InfinitoApi = require('node-infinito-api');
const BigNumber = require('bignumber.js');
const api = new InfinitoApi(config.infinitoApiOpts);
const StakingPlatform = require('app/lib/staking-api/staking-platform');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const logHangout = require("app/lib/logger/hangout");
const dbLogger = require('app/lib/logger/db');
const AdaService = require("app/lib/ada");
const bech32 = require("bech32");

class ADA extends GetMemberAsset {
  constructor() {
    super();
  }
  async getValidators() {
    if (!this.validators || !this.pools) {
      let res = await StakingPlatform.getValidatorInfo('TADA')
      this.validators = res.data.map(x => x.address);
      this.pools = res.data.map(x => x.pool_id);
      console.log('pools', this.pools)
    }
  }
  async setValidators(addresses) {
    this.validators = addresses
  }
  async get(address) {
    try {
      await this.getValidators();
      const unclaim_reward = await getRewardADA(address, this.validators);
      const amount = await getStaked(address, this.pools);

      const balance = await getBalanceADA(address);
      if (!unclaim_reward.isPool) {
        return {
          balance,
          amount: amount,
          unclaimReward: 0,
          reward: 0
        }
      }
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      // get old
      const MemberAsset = require('app/model/wallet').member_assets;
      let memberAsset = await MemberAsset.findOne({
        where: {
          platform: 'TADA',
          address: address,
          missed_daily: false,
          created_at: { [Op.lt]: date }
        },
        order: [['created_at', 'DESC']],
        raw: true
      })
      const claimedRewars = await getClaimedReward(address, memberAsset);

      // first init
      if (!memberAsset) {
        return {
          balance,
          amount,
          unclaimReward: unclaim_reward.reward,
          reward: unclaim_reward.reward,
          opts: claimedRewars.lastTx
        }
      }

      // continue check
      const reward = unclaim_reward.reward - (memberAsset.unclaim_reward - claimedRewars.totalClaimedReward)

      const result = {
        balance,
        amount,
        unclaimReward: unclaim_reward.reward,
        reward,
        opts: claimedRewars.lastTx
      };
      return result;
    } catch (error) {
      logger[error.canLogAxiosError ? 'error' : 'info'](error);
      await dbLogger(error, address);
      logHangout.write(JSON.stringify(error));
      return null;
    }
  }
}

async function getBalanceADA(address) {
  try {
    const apiCoin = api['ADA'];
    const balanceResult = await apiCoin.getBalance(address);
    const balance = BigNumber(balanceResult.data.balance).toNumber();
    return balance;
  }
  catch (error) {
    await dbLogger(error, address);
    logger.error(error);
    logHangout.write(JSON.stringify(error));
    throw error;
  }
}

async function getClaimedReward(delegatorAddress, memberAsset) {
  try {
    let lastTx = memberAsset ? memberAsset.tracking : null;
    let totalClaimedReward = 0;
    let currentBlockHash = await AdaService.getLatestBlock();
    while (true) {
      let payload = {
      };
      if (lastTx)
        payload = {
          after_block: lastTx.block,
          after_tx: lastTx.tx
        };
      let data = await AdaService.getTransactionDetail({
        address: delegatorAddress,
        until_block: currentBlockHash.hash,
        ...payload
      });
      //check the same data
      if (!data || data.length == 0) {
        break;
      }

      lastTx = {
        block: data[data.length - 1].block_hash,
        tx: data[data.length - 1].hash
      }
      // check reward tx
      let rewardTxs = data.filter(x => x.withdrawals.length > 0);
      if (rewardTxs.length > 0) {
        rewardTxs.forEach(x => {
          x.withdrawals.forEach(y => {
            totalClaimedReward += BigNumber(y.amount).toNumber();
          })
        })
      }
    }
    return {
      totalClaimedReward,
      lastTx
    }
  } catch (error) {
    await dbLogger(error);
    logger.error(error);
    logHangout.write(JSON.stringify(error));
    throw error;
  }
}

async function getRewardADA(address, validators) {
  try {
    let params = [
      {
        name: "getCurrentReward",
        method: "GET",
        url: '/chains/v1/ADA/addr/{addr}/reward',
        "params": [
          "addr",
        ]
      }
    ];
    api.extendMethod("chains", params, api);
    const response = await api.chains.getCurrentReward(address);
    let isPool = false
    if (response && response.data && response.data.length > 0) {
      let reward = 0;
      response.data.forEach(item => {
        if (validators.find(x => x == item.delegation)) {
          reward += item.rewardAccountBalance;
          isPool = true;
        }
      });
      return {
        reward,
        isPool
      }
    }
    else {
      return {};
    }
  }
  catch (error) {
    await dbLogger(error);
    logger.error(error);
    logHangout.write(JSON.stringify(error));
    throw error;
  }
}

async function getStaked(address, pools) {
  try {
    const decodedAddr = bech32.decode(address, 200);
    const bytes = Buffer.from(bech32.fromWords(decodedAddr.words, 'hex'));
    const hexKeys = bytes.toString('hex').slice(2);
    const length = hexKeys.length;
    const stakeKey = hexKeys.slice(length / 2);
    const stakeAddr = bech32.encode('stake', bech32.toWords(Buffer.from('e1' + stakeKey, 'hex')));

    const currentEpoch = await AdaService.getCurrentEpoch();
    const result = await AdaService.getActiveStakeAddress({
      validators: pools,
      epoch: currentEpoch,
      limit: 50,
      delegators: [stakeAddr]
    });

    if (result.data.activeStake.length > 0) {
      const total = result.data.activeStake.reduce((sum, item) => {
        return sum += (+item.amount);
      }, 0);
      return total;
    }

    return 0;
  }
  catch (error) {
    await dbLogger(error);
    logger.error(error);
    logHangout.write(JSON.stringify(error));
    throw error;
  }
}

module.exports = ADA;
