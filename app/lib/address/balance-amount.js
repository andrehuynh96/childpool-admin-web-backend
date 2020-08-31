const axios = require('axios');
const logger = require('app/lib/logger');
const config = require('app/config');
const InfinitoApi = require('node-infinito-api');
const { GovernanceTxBuilder, Crypto } = require('ontology-ts-sdk');
const BigNumber = require('bignumber.js');
const qtum = require('qtumjs-lib');
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
                const result = await getBalanceAmountONE(address);
                return result;
            }
            else if (platform == 'QTUM') {
                const result = await getBalanceAmountQTUM(address);
                return result;
            }
            else {
                const result = {};
                return result;
            }
        }
        catch (error) {
            logger.error('get balance and amount fail', error);
            return {
                balance: 0,
                amount: 0
            };
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
    const getBalancePath = `${network}/chains/main/blocks/head/context/contracts/${address}/balance`;

    const balanceResult = await axios.get(getBalancePath);
    const balance = BigNumber(balanceResult.data).toNumber();

    return {
        amount: balance,
        balance: balance
    };
}

async function getBalanceAmountONE(address) {
    let balance = 0;
    const shards = Object.values(config.harmony);
    for (let item of shards){
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
    return {
        balance: balance,
        amount: 0
    };
}

async function getBalanceAmountQTUM(address) {
    const api = axios.create({
        baseURL: config.qtumApi,
        timeout: 2000
    });
    const res = await api.get(`/address/${address}/balance`);
    const balance = BigNumber(res.data).times(BigNumber(10).pow(-8)).toNumber();
    console.log(balance);
    return {
        balance: balance,
        amount: 0
    };
}



