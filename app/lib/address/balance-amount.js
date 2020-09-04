const axios = require('axios');
const logger = require('app/lib/logger');
const config = require('app/config');
const InfinitoApi = require('node-infinito-api');
const { GovernanceTxBuilder, Crypto } = require('ontology-ts-sdk');
const BigNumber = require('bignumber.js');
const { Harmony } = require('@harmony-js/core');
const {
  ChainID,
  ChainType,
  hexToNumber,
  fromWei,
  Units,
} = require('@harmony-js/utils');
module.exports = {
  getBalanceAmount: async (platform, address) => {
    try {
      if (platform == 'IRIS' || platform == 'ATOM') {
        const result = await getBalanceAmountFromABP(platform, address);
        return result;
      }
      else if (platform == 'ONT') {
        const result = await getBalanceAmountONTAndONG(platform, address);
        return result;
      }
      else if (platform == 'XTZ') {
        const result = await getBalanceAmountXTZ(address);
        return result;
      }
      else if (platform == 'ONE') {
        const balance = await getBalanceONE(address);
        const amount = await getAmountONE(address);
        return {
          balance: balance,
          amount: amount
        };
      }
      else if (platform == 'QTUM') {
        const result = await getBalanceAmountQTUM(address);
        return result;
      }
      else {
        const balance = await getBalanceADA(address);
        const amount = await getAmountADA(address);
        return {
          balance: balance,
          amount: amount
        };
      }
    }
    catch (error) {
      logger.error('get balance and amount fail', error);
      return false;
    }
  }
};

async function getBalanceAmountFromABP(platform, address) {
  const api = new InfinitoApi(config.opts);
  const apiCoin = api[platform];
  const balanceResult = await apiCoin.getBalance(address);
  const amountResult = await apiCoin.getListDelegationsOfDelegator(address);
  const balance = balanceResult.data.balance;
  let amount = 0;
  if (amountResult.data.length > 0) {
    amountResult.data.forEach(item => {
      amount += BigNumber(item.balance).toNumber();
    });
  }
  return {
    balance: balance,
    amount: amount
  };
}

async function getBalanceAmountONTAndONG(platform, address) {
  const network = config.ONT.network;
  const assetName = platform.toLowerCase();
  const getAsset = await axios.get(`${network}/v2/addresses/${address}/balances?asset_name=${assetName}`);
  const balance = BigNumber(getAsset.data.result[0].balance).toNumber();

  // GET Staking Amount
  const userAddr = new Crypto.Address(address);
  const pk = config.ONT.validatorAddress;
  const authorizeInfo = await GovernanceTxBuilder.getAuthorizeInfo(pk, userAddr, network);
  let amount = 0;
  if (authorizeInfo) {
    const { consensusPos, freezePos, newPos } = authorizeInfo;
    amount = consensusPos + freezePos + newPos;
  }

  return {
    balance: balance,
    amount: amount,
  };
}

async function getBalanceAmountXTZ(address) {
  const network = config.tezos.tezosServerUrl;
  const getBalancePath = `${network}/chains/main/blocks/head/context/contracts/${address}/balance`;

  const balanceResult = await axios.get(getBalancePath);
  const balance = BigNumber(balanceResult.data).toNumber();

  return {
    amount: balance,
    balance: balance
  };
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

async function getAmountONE(address) {
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
  const { result } = response.data;
  result.forEach(item => {
    amount += item.amount;
  });
  const totalAmount = BigNumber(amount).toNumber();
  return totalAmount;
}

async function getBalanceAmountQTUM(address) {
  const api = axios.create({
    baseURL: config.qtumApi,
    timeout: 2000
  });
  const result = await api.get(`/address/${address}`);
  const balance = BigNumber(result.data.balance).toNumber();
  const amount = BigNumber(result.data.staking).toNumber();
  return {
    balance: balance,
    amount: amount
  };
}

async function getBalanceADA(address) {
  const api = new InfinitoApi(config.opts);
  const apiCoin = api['ADA'];
  const balanceResult = await apiCoin.getBalance(address);
  const balance = BigNumber(balanceResult.data.balance).toNumber();

  return balance;
}

async function getAmountADA(address) {
  const api = new InfinitoApi(config.opts);
  const bestBlock = await getBestBlockADA(api);
  if (bestBlock) {
    const response = await getAdaShelleyDelegationsInfoOfDelegator(bestBlock.hash,address);
    if (response && response.pool_id) {
      const adaValidatorURL =  `https://js.adapools.org/pools/${response.pool_id}/summary.json`;
      let { data: { data: { total_stake } } }  = await axios.get(adaValidatorURL);
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

async function getBestBlockADA(api) {
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
    return null;
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
      } else {

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
            }
            else {
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
    return {};
  }
}


