const exchangeCurrencies = require('../../model/wallet').exchange_currencies;
const logger = require("app/lib/logger");
const Changelly = require('../../service/exchange/changelly');
const SyncCurrencyChangellyServices = require("../service/Sync-currency-with-changelly");
const config = require('app/config');
const status = require('../../model/wallet/value-object/exchange-currency-status');

module.exports = {
  execute: async () => {
    try {
      const getCurrencies = new Changelly().getCurrencies();
      const syncCurrencyServices = new SyncCurrencyChangellyServices();
      const getChangellyData = await getCurrencies;
      const exchangeCurrenciesDB = await exchangeCurrencies.findAll({
        where: {
          status: status.ENABLED
        }
      });
      const currenciesDisableByJob = await exchangeCurrencies.findAll({
        where: {
          turn_off_by_job_flg: true
        }
      });
      let changellyData = getChangellyData.result;
      if (changellyData && exchangeCurrenciesDB) {
        changellyData = changellyData.map(x => {
          return {
            ...x,
            symbol: x.ticker.toUpperCase(),
            platform: (x.contract_address && x.address_url.startsWith("https://etherscan.io")) ? "ETH" : x.ticker.toUpperCase()
          };
        });

        let exchangeCurrenciesData = [];
        for (let e of exchangeCurrenciesDB) {
          let item = changellyData.find(x => x.symbol == e.symbol.toUpperCase() && x.platform == e.platform.toUpperCase());
          if (!item) {
            continue;
          }
          const changellyStatus = item.enabled ? status.ENABLED : status.DISABLED;
          if (e.status != changellyStatus || item.fix_rate_enabled != e.fix_rate_flg) {
            await exchangeCurrencies.update({
              status: changellyStatus,
              fix_rate_flg: item.fix_rate_enabled,
              turn_off_by_job_flg: true
            }, {
                where: {
                  symbol: e.symbol
                }
              });
            if (config.sendMailToAdminFlg) {
              const data = {
                status: changellyStatus ? "ENABLED" : "DISABLED",
                fix_rate_flg: item.fix_rate_enabled ? "ENABLED" : "DISABLED",
                symbol: e.symbol,
                platform: e.platform
              };
              exchangeCurrenciesData.push(data);
            }
          }
        }
        if (exchangeCurrenciesData.length > 0) {
          syncCurrencyServices.sendMail(exchangeCurrenciesData);
        }

        const currencyDisableData = [];
        for (let e of currenciesDisableByJob) {
          let item = changellyData.find(x => x.symbol == e.symbol.toUpperCase() && x.platform == e.platform.toUpperCase());
          if (!item) {
            continue;
          }
          const changellyStatus = item.enabled ? status.ENABLED : status.DISABLED;

          if (e.status != changellyStatus || item.fix_rate_enabled != e.fix_rate_flg) {
            if (config.sendMailToAdminFlg) {
              const data = {
                status: changellyStatus ? "ENABLED" : "DISABLED",
                fix_rate_flg: item.fix_rate_enabled ? "ENABLED" : "DISABLED",
                symbol: e.symbol,
                platform: e.platform
              };
              currencyDisableData.push(data);
            }
            await exchangeCurrencies.update({
              turn_off_by_job_flg: false
            }, {
                where: {
                  symbol: e.symbol
                }
              });
          }
        }

        if (currencyDisableData.length > 0) {
          syncCurrencyServices.sendMail(currencyDisableData, false);
        }

      }
    }
    catch (err) {
      logger.error(err);
    }
  }
};
