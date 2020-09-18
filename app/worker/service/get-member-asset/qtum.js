const GetMemberAsset = require("./base");
const logger = require('app/lib/logger');
const axios = require('axios');
const config = require('app/config');
const BigNumber = require('bignumber.js');
const StakingPlatform = require('app/lib/staking-api/staking-platform');
const MemberAsset = require('app/model/wallet').member_assets;
class QTUM extends GetMemberAsset {
  constructor() {
    super();
  }
  async get(address) {
    try {
      const api = axios.create({
        baseURL: config.qtum.url,
        timeout: 20000
      });
      let balance = 0;
      let amount = 0;
      let reward = 0;
      let result = await api.get(`/address/${address}`);
      if (result.data) {
        balance = BigNumber(result.data.balance).toNumber();
        amount = BigNumber(result.data.mature).toNumber();
      }
      const validatorAddresses = await StakingPlatform.getValidatorAddresses('QTUM');
      if (validatorAddresses.length > 0) { 
        let addressTransactions = await api.get(`/address/${address}/txs`);
        if (addressTransactions.data && addressTransactions.data.totalCount > 0) {
          let memberAsset = await MemberAsset.findOne({
            where: {
              platform: 'QTUM',
              address: address
            },
            order: [['created_at', 'DESC']]    
          })
          let total = addressTransactions.data.totalCount;
          let offset = 0;
          let limit = 20;
          let txs = [];
          while (true) { 
            let res = await api.get(`/address/${address}/basic-txs?offset=${offset}&limit=${limit}`);
            if (res.data && res.data.transactions.length > 0) {
              if (memberAsset && res.data.transactions[0].timestamp < Date.parse(memberAsset.created_at) / 1000) {
                break;
              }
              for (let tx of res.data.transactions) {
                let txDetail = await api.get(`/tx/${tx.id}`);
                if (validatorAddresses.indexOf(txDetail.data.inputs[0].address) != -1 && tx.type == 'block-reward') {
                  tx.reward = Math.abs(BigNumber(tx.amount));
                  txs.push(tx);
                }
              }
              offset = offset + limit;
              if (offset >= total) {
                break;
              }
              continue;
            }
            break;
          }
          console.log('txs: ', txs);
          if (txs.length > 0) {
            for (let e of txs) {
              if (!memberAsset) {
                reward = reward + e.reward
              }else if (e.timestamp >= Date.parse(memberAsset.created_at) / 1000) {
                reward = reward + e.reward;
              }
            }
          }
        }
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

module.exports = QTUM;
