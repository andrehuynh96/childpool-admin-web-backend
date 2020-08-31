const axios = require('axios');
// const logger = require('app/lib/logger');
const config = require('app/config');
const InfinitoApi = require('node-infinito-api');
const { GovernanceTxBuilder, Crypto} = require('ontology-ts-sdk');
const BigNumber = require('bignumber.js');
const path = require("path");
module.exports = {
    getBalanceAmount: async (platform,address) => {
        if (platform == 'IRIS' || platform == 'ATOM') {
            const result = await getBalanceAmountFromABP(platform,address);
            return result;
        }
        else if (platform == 'ONT') {
            const result = await getBalanceAmountONTAndONG(platform,address);
            return result;
        }
        else if (platform == 'XTZ') {
            const result = await getBalanceAmountXTZ(address);
            return result;
        }
        else {
            return {
                balance: 0,
                amount: 0
            };
        }
    }
};

async function getBalanceAmountFromABP(platform,address) {
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

async function getBalanceAmountONTAndONG(platform,address) {
    const network = config.ONT.network;
    const assetName = platform.toLowerCase();
    const getAsset =  await axios.get(`${network}/v2/addresses/${address}/balances?asset_name=${assetName}`);
    const balance = BigNumber(getAsset.data.result[0].balance).times(1e9).toNumber();

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
    const getBalancePath = `/chains/main/blocks/head/context/contracts/${address}/balance`;
    const getAmountPath = `/chains/main/blocks/head/context/delegates/${address}`;
    let options = {
        method: 'GET',
        qs: {
          chain: 'main',
        },
        headers: {
          'Content-Type': 'application/json'
        },
      };

    let balanceResult = await axios.get(path.join(network,getBalancePath));
    // let amountResult = await axios(path.join(network,getAmountPath));
    console.log(balanceResult);
    return {
        amount: 0,
        balance: balanceResult.data
    };
}




