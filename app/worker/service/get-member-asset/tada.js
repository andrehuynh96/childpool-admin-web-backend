const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const axios = require('axios');
const config = require('app/config');
const InfinitoApi = require('node-infinito-api');
const BigNumber = require('bignumber.js');
const api = new InfinitoApi(config.infinitoApiOpts);
class ADA extends GetMemberAsset {
  constructor() {
    super();
    this.validators = ['237795878bfa5352cca325012e073b344ce337a1dd752cd3d5ea4cdc']
  }
  async get(address) {
    try {
      // address = 'addr1q85j6k40ezt58dzp67dkelrqpm2e8ghnp664t0r6chc0nltun3lw37skprm0w3zhmp33ql35xeq82s9kvtn9ycq3lcps3hl8hl'
      // address = 'addr1qxv0jfsyzt9kp6nyp026xqfwr2gglv8cjr0r8fnpd3nqm5lwz8pd3q3kegvtxv3pv2ecggtsvdfntf89qg0qy7g0rvlq52nztn'
      // address = 'addr1q87q0k3q05gq48veesrz2z0cfgx5ru6fwkhnx3vpwm8va7mm3frj4vwws7cu0fpce6gqev0pca4cn0x9cq7r89wf2h4q9neh4f'
      const unclaim_reward = await getRewardADA(address, this.validators);
      if(!unclaim_reward.isPool){
        return {
          balance,
          amount:0,
          unclaim_reward:0,
          reward: 0
        }
      }
      const balance = await getBalanceADA(address);
      const totalClaimedReward = await getClaimedReward(address, this.validators);
      const amount = balance + unclaim_reward.reward;

      // get old 
      let memberAsset = await MemberAsset.findOne({
        where: {
          platform: 'TADA',
          address: address
        },
        order: [['created_at', 'DESC']]    
      })

      const reward = unclaim_reward - (memberAsset.unclaim_reward - totalClaimedReward)
      const result = {
        balance:1,
        amount:1,
        unclaim_reward:1,
        reward
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

async function getClaimedReward(currentBlockHash, delegatorAddress) {
  try {
    let lastTx = null
    let totalClaimedReward = 0; 
    while(true){     
      let payload = {
        addresses: [
          delegatorAddress
        ],
        untilBlock: currentBlockHash
      };
      if(lastTx)
        payload = {
          ...payload,
          after: {
            block: lastTx.block,
            tx: lastTx.tx
          }
        };
      let { data } = await axios.post('https://iohk-mainnet.yoroiwallet.com/api/v2/txs/history', payload);

      //check the same data
       if(!data || data.length == 0){
        // TODO save last tx
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
            totalReward += BigNumber(y.amount).toNumber();
          })
        })
      }
    }
    return totalClaimedReward
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
