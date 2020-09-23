const exchangeCurrencies = require('../../model/wallet').exchange_currencies;
const logger = require("app/lib/logger");
const changelly = require('../../service/exchange/changelly');

module.exports = {
  execute: async () => {
    try {
      const getCurrencies = new changelly().getCurrencies();
      const getChangellyData = await getCurrencies;
      const exchangeCurrenciesDB = await exchangeCurrencies.findAll();
      const changellyData = getChangellyData.result;

      if (changellyData && exchangeCurrenciesDB) {

        for (let i = 0; i < changellyData.length; i++) {
          const changellyTicker = changellyData[i].ticker;
          const changellyEnabled = changellyData[i].enabled ? 1 : 0;
          const changellyFixRate = changellyData[i].fix_rate_enabled;

          exchangeCurrenciesDB.map(async (item) => {
            if (changellyTicker.toLowerCase() === item.symbol.toLowerCase()) {
              if (changellyEnabled !== item.status || changellyFixRate !== item.fix_rate_flg) {
                let update = {};
                if (changellyEnabled !== item.status) update = { ...update, status: changellyEnabled };
                if (changellyFixRate !== item.fix_rate_flg) update = { ...update, fix_rate_flg: changellyFixRate };
                await exchangeCurrencies.update(update, {
                  where: {
                    symbol: item.symbol
                  }
                });
                // log
                logger.info('Status/FixRate change: coin/token - ', item.symbol);
                if (changellyEnabled !== item.status) logger.info('Status: ', "Changlelly: " + changellyEnabled + " - DB: " + item.status);
                if (changellyFixRate !== item.fix_rate_flg) logger.info('FixRate:', "Changlelly: " + changellyFixRate + " - DB: " + item.fix_rate_flg);
              }
            }
          });

        }
      }
    }
    catch (err) {
      logger.error(err);
    }
  }
};
