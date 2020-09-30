const ExchangeTransaction = require("app/model/wallet").exchange_transactions;
const ExchangeTransactionStatus = require("app/model/wallet/value-object/exchange-transaction-status");
const ExchangeTransactionProvider = require("app/model/wallet/value-object/exchange-provider");
const ExchangeFactory = require('app/service/exchange/factory');
const ExchangeProvider = require('app/service/exchange/provider');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const logger = require("app/lib/logger");
const sleep = require('sleep-promise');
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

        if (tStatusResult.result.toUpperCase() == ExchangeTransactionStatus.FINISHED ||
          tStatusResult.result.toUpperCase() == ExchangeTransactionStatus.FAILED ||
          tStatusResult.result.toUpperCase() == ExchangeTransactionStatus.REFUNDED)
          await _syncTransaction({
            service: Service,
            platform: t.from_currency,
            extra_id: t.payin_extra_id,
            payin_address: t.payin_address,
            transaction_id: t.transaction_id,
          })
        await sleep(1000);
      }
    }
    catch (err) {
      logger.error(err);
    }
  }
}

async function _syncTransaction({ service, platform, payin_address, extra_id, transaction_id }) {
  try {
    let limit = 100;
    let offset = 0;
    let page = 0;
    let fetch = true;
    while (fetch) {
      let result = await service.getTransaction({
        currency_from: platform,
        payin_address: payin_address,
        extra_id: extra_id,
        limit: limit,
        offset: offset
      });

      let item = result.result.find(x => x.id == transaction_id);
      if (item) {
        let data = {};
        if (item.payin_hash) {
          data.tx_id = item.payin_hash;
        }
        await ExchangeTransaction.update({
          ...data,
          amount_to: item.amount_to ? parseFloat(item.amount_to) : 0,
          provider_track_url: item.track_url || "",
          payout_tx_id: item.payout_hash || item.refund_hash,
          network_fee: item.network_fee ? parseFloat(item.network_fee) : 0,
          total_fee: item.total_fee ? parseFloat(item.total_fee) : 0,
          rate: item.rate ? parseFloat(item.rate) : 0,
          amount_from: item.amount_from ? parseFloat(item.amount_from) : 0,
          provider_fee: item.changelly_fee ? parseFloat(item.changelly_fee) : 0
        }, {
            where: {
              transaction_id: transaction_id
            },
          });
      }

      if (item || result.result.length < limit) {
        fetch = false;
      }
      if (fetch) {
        offset = (page * limit) + limit;
        page++;
      }

      await sleep(500);
    }
  }
  catch (err) {
    logger.error(err);
  }
}