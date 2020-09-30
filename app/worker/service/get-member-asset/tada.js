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
  }
  async get(address) {
    try {
      const balance = await getBalanceADA(address);
      const amount = await getAmountADA(address);
      const reward = await getRewardADA(address);
      const result = {
        balance: balance,
        amount: amount,
        reward: reward
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

async function getAmountADA(address) {
  try {
    const bestBlock = await getBestBlockADA();
    if (bestBlock) {
      const response = await getAdaShelleyDelegationsInfoOfDelegator(bestBlock.hash, address);
      if (response && response.pool_id) {
        const adaValidatorURL = `https://js.adapools.org/pools/${response.pool_id}/summary.json`;
        let { data: { data: { total_stake } } } = await axios.get(adaValidatorURL);
        if (total_stake) {
          return BigNumber(total_stake).toNumber();
        }
        else {
          return 0;
        }
      }
      else {
        return 0;
      }
    }
    return 0;
  }
  catch (err) {
    logger.error(err);
    throw err;
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

async function getAdaShelleyDelegationsInfoOfDelegator(currentBlockHash, delegatorAddress) {
  try {
    let payload = {
      addresses: [
        delegatorAddress
      ],
      untilBlock: currentBlockHash
    };
    let { data } = await axios.post('https://iohk-mainnet.yoroiwallet.com/api/v2/txs/history', payload);
    if (data && data.length > 0) {

      let lastTx = data[data.length - 1];
      let certs = lastTx.certificates.filter(cer => cer.kind == 'StakeDelegation');
      if (certs && certs.length > 0) {
        return {
          pool_id: certs[0].poolKeyHash,
          amount: BigNumber(lastTx.outputs[0].amount).div(1e6).toNumber(),
          is_registered: true
        };
      }
      else {
        let listStakedTxs = data.filter(el => {
          if (el.certificates.length > 0) {
            let stakedDelegations = el.certificates.filter(cer => cer.kind == 'StakeDelegation');
            return stakedDelegations.length > 0;
          } else {
            return false;
          }
        });
        if (listStakedTxs.length > 0) {
          let txDelegation = listStakedTxs[listStakedTxs.length - 1];
          let cert = txDelegation.certificates.filter(el => el.kind == 'StakeDelegation');
          if (cert.length > 0) {
            return {
              pool_id: cert[0].poolKeyHash,
              is_registered: true
            };
          }

        } else {
          let listRegisterCertificates = data.filter(el => {
            if (el.certificates.length > 0) {
              let StakeRegistration = el.certificates.filter(cer => cer.kind == 'StakeRegistration');
              return StakeRegistration.length > 0;
            } else {
              return false;
            }
          });
          if (listRegisterCertificates && listRegisterCertificates.length > 0) {
            return {
              is_registered: true
            };
          }
        }
      }
    }
    return {};
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function getRewardADA(address) {
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
    if (response && response.data.length > 0) {
      let reward = 0;
      response.data.forEach(item => {
        reward += item.rewardAccountBalance;
      });
      return reward;
    }
    else {
      return 0;
    }
  }
  catch (error) {
    logger.error(error);
    throw error;
  }
}

module.exports = ADA;
