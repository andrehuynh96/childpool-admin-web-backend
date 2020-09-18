const ExchangeTransaction = require("app/model/wallet").exchange_transactions;
const ExchangeTransactionStatus = require("app/model/wallet/value-object/exchange-transaction-status");
const ExchangeTransactionProvider = require("app/model/wallet/value-object/exchange-provider");
const ExchangeFactory = require('app/service/exchange/factory');
const ExchangeProvider = require('app/service/exchange/provider');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const logger = require("app/lib/logger");
const sleep = require('sleep');
const mappingProvider = {
  [ExchangeTransactionProvider.CHANGELLY]: [ExchangeProvider.Changelly]
}

module.exports = {
  execute: async () => {
    try {
      let transactions = await ExchangeTransaction.findAll({
        where: {
          status: {
            [Op.in]: [
              ExchangeTransactionStatus.NEW,
              ExchangeTransactionStatus.WAITING,
              ExchangeTransactionStatus.CONFIRMING,
              ExchangeTransactionStatus.EXCHANGING,
              ExchangeTransactionStatus.SENDING,
              ExchangeTransactionStatus.HOLD,
              ExchangeTransactionStatus.EXPIRED,
              ExchangeTransactionStatus.OVERDUE
            ]
          }
        },
        raw: true
      })

      for (let t of transactions) {
        const Service = ExchangeFactory.create(mappingProvider[t.provider], {});
        let tStatusResult = await Service.getStatus({ transaction_id: t.transaction_id });
        if (tStatusResult.error) {
          logger.error(`${t.provider}: ${t.transaction_id}: ${result.error.message}`);
          continue;
        }

        await ExchangeTransaction.update({
          status: tStatusResult.result.toUpperCase()
        }, {
            where: {
              id: t.id
            },
          });
        sleep.sleep(1);
      }

    }
    catch (err) {
      logger.error(err);
    }
  }
} 