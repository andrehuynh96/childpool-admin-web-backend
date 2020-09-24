const exchangeCurrencies = require('../../model/wallet').exchange_currencies;
const logger = require("app/lib/logger");
const Changelly = require('../../service/exchange/changelly');
const SyncCurrencyChangellyServices = require("../service/Sync-currency-with-changelly");
const config = require('app/config');

module.exports = {
  execute: async () => {
    try {
      const getCurrencies = new Changelly().getCurrencies();
      const syncCurrencyServices = new SyncCurrencyChangellyServices();
      const getChangellyData = await getCurrencies;
      const exchangeCurrenciesDB = await exchangeCurrencies.findAll({ where: { status: 1 } });
      const changellyData = getChangellyData.result;
      if (changellyData && exchangeCurrenciesDB) {

        for (let i = 0; i < changellyData.length; i++) {
          const changellyTicker = changellyData[i].ticker;
          const changellyPlatform = (changellyData[i].contract_address && changellyData[i].address_url.startsWith("https://etherscan.io")) ? "ETH" : changellyData[i].ticker.toUpperCase();
          const changellyEnabled = changellyData[i].enabled ? 1 : 0;
          const changellyFixRate = changellyData[i].fix_rate_enabled;

          exchangeCurrenciesDB.map(async (item) => {
            if (changellyTicker.toUpperCase() === item.symbol.toUpperCase() && changellyPlatform === item.platform.toUpperCase()) {
              if (changellyEnabled !== item.status || changellyFixRate !== item.fix_rate_flg) {
                let update = {};
                if (changellyEnabled !== item.status) update = { ...update, status: changellyEnabled };
                if (changellyFixRate !== item.fix_rate_flg) update = { ...update, fix_rate_flg: changellyFixRate };
                await exchangeCurrencies.update(update, {
                  where: {
                    symbol: item.symbol
                  }
                });
                // sent email
                if (config.sendMailToAdminFlg) {
                  const data = { ...update, symbol: item.symbol, flatForm: changellyPlatform };
                  syncCurrencyServices.sendMail(data);
                }
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
