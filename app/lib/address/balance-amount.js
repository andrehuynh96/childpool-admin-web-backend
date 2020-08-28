const axios = require('axios');
const logger = require('app/lib/logger');
const config = require('app/config');
const InfinitoApi = require('node-infinito-api');
module.exports = {
    getBalanceAmount: async (platform,address) => {
        console.log(platform,address);
        if (platform == 'IRIS' || platform == 'ATOM') {
            const result = await getBalanceAmountFromABP(platform,address);
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
    // const amountResult = await apiCoin.getDelegations(address);
    // console.log(balanceResult,amountResult);

    return {
        balance: balanceResult.data,
        // amount: amountResult
    };
}

