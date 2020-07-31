const logger = require('app/lib/logger');
const config = require("app/config");

module.exports = {
    getStakingCurrencyList: async (req, res, next) => {
        try {
          const stakingCurrencyStr = config.stakingCurrency;
          const stakingCurrencies = stakingCurrencyStr.split(',');
          const stakingCurrencyList = stakingCurrencies.map(item => {
            return {
              currency_symbol: item,
              name: item,
            };
          });
    
          return res.ok(stakingCurrencyList);
        }
        catch (error) {
          logger.error("get staking currency list fail", error);
          next(error);
        }
      },
};