const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const config = require('app/config');
const BigNumber = require('bignumber.js');
const InfinitoApi = require('node-infinito-api');
const StakingPlatform = require('app/lib/staking-api/staking-platform');
const MemberAsset = require('app/model/wallet').member_assets;
const api = new InfinitoApi(config.infinitoApiOpts);
class IRIS extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address) {
    try {  
      const apiCoin = api['IRIS'];
      let balance = 0;
      let amount = 0;
      let reward = 0;
      let unclaimReward = 0;

      const balanceResult = await apiCoin.getBalance(address);
      if (balanceResult && balanceResult.data) {
        balance = balanceResult.data.balance * 1e18;
      }

      const amountResult = await apiCoin.getListDelegationsOfDelegator(address);
      if (amountResult && amountResult.data.length > 0) {
        amountResult.data.forEach(item => {
          amount += BigNumber(item.shares).toNumber();
        });
      }
      const validatorAddresses = await StakingPlatform.getValidatorAddresses('IRIS');
      if (validatorAddresses.length > 0) {
        const rewardResult = await apiCoin.getRewards(address);
        if (rewardResult && rewardResult.data.total.length > 0) {
          for (let e of rewardResult.data.delegations) {
            if (validatorAddresses.indexOf(e.validator) != -1) {
              for (let r of e.reward) {
                unclaimReward = unclaimReward + BigNumber(r.amount).toNumber();
              }
            }
          }
          let memberAsset = await MemberAsset.findOne({
            where: {
              platform: 'IRIS',
              address: address
            },
            order: [['created_at', 'DESC']]    
          })
          if (memberAsset) {
            let number = 0;
            let histories = await getHistories(address);
            if(histories && histories.data && histories.data.txs && histories.data.txs.length>0){
              let txs=histories.data.txs;
              let claim = 0;
              logger.info('Iris txs: ', txs)
              for (let tx of txs) {
                if (tx.tx_type = 'get_delegator_rewards_all' && Date.parse(tx.timestamp) >= Date.parse(memberAsset.created_at)) {
                  claim = claim + BigNumber(tx.amount).toNumber() * 1e18;
                  logger.info('claim: ', claim);
                }
              }
              number = unclaimReward + claim - BigNumber(memberAsset.unclaim_reward).toNumber();
            }
            reward = number >= 0 ? number : unclaimReward;
          } else {
            reward = unclaimReward;
          }
        }
      }
      return {
        balance: balance,
        amount: amount,
        reward: reward,
        unclaimReward: unclaimReward
      };
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}

const getHistories=async (address)=>{
  try {
    let params = [
      {
        name: "getAllTransactionHistory",
        method: "GET",
        url: `/chains/v1/IRIS/addr/${address}/txs?offset=0&limit=50`
      }
    ];

    api.extendMethod("chains", params, api);
    const response = await api.chains.getAllTransactionHistory();
    console.log("################: ", response);
    return response;
  }catch(err){
    console.log(err)
    return null
  }
}

module.exports = IRIS;
