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
class ADA extends GetMemberAsset {
  constructor() {
    super();
  }
  async getValidators(){
    if(!this.validators){
      let res = await StakingPlatform.getValidatorInfo('TADA')
      this.validators = res.data.map(x => x.address)
    }
  }
  async setValidators(addresses){
    this.validators = addresses
  }
  async get(address) {
    try {
      await this.getValidators();
      const unclaim_reward = await getRewardADA(address, this.validators);
      const balance = await getBalanceADA(address);
      if(!unclaim_reward.isPool){
        return {
          balance,
          amount:0,
          unclaimReward:0,
          reward: 0
        }
      }           
      const amount = balance;
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
      if(!memberAsset){
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
      logger.error(error);
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
    logger.error(error);
    throw error;
  }
}

async function getBestBlockADA() {
  try {
    let params = [
      {
        name: "getBestBlock",
        method: "GET",
        url: '/chains/v1/ADA/bestblock'
      }
    ];

    api.extendMethod("chains", params, api);
    const response = await api.chains.getBestBlock();
    if (response.data && response.cd == 0) {
      return response.data;

    } else {
      return null;
    }
  }
  catch (err) {
    logger.error(err);
    throw err;
  }
}

async function getClaimedReward(delegatorAddress, memberAsset) {
  try {
    let lastTx = memberAsset ? memberAsset.tracking : null
    let totalClaimedReward = 0; 
    let currentBlockHash = await getBestBlockADA();
    while(true){     
      let payload = {
        addresses: [
          delegatorAddress
        ],
        untilBlock: currentBlockHash.hash
      };
      if(lastTx)
        payload = {
          ...payload,
          after: lastTx
        };
      let { data } = await axios.post('https://iohk-mainnet.yoroiwallet.com/api/v2/txs/history', payload);

      //check the same data
       if(!data || data.length == 0){
        break;
      }
        
      lastTx = {
        block: data[data.length -1].block_hash,
        tx: data[data.length -1].hash
      }
      // check reward tx
      let rewardTxs = data.filter(x => x.withdrawals.length > 0);
      if(rewardTxs.length > 0){
        rewardTxs.forEach(x => {
          x.withdrawals.forEach( y => {
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
    logger.error(error);
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
    if (response && response.data.length > 0) {
      let reward = 0;
      response.data.forEach(item => {
        if(validators.find( x => x == item.delegation)){
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
    logger.error(error);
    throw error;
  }
}

module.exports = ADA;
