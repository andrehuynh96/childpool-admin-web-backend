const ExchangeTransaction = require("app/model/wallet").exchange_transactions;
const ExchangeTransactionStatus = require("app/model/wallet/value-object/exchange-transaction-status");
const ExchangeTransactionProvider = require("app/model/wallet/value-object/exchange-provider");
const ExchangeFactory = require('app/service/exchange/factory');
const ExchangeProvider = require('app/service/exchange/provider');
const Member = require('app/model/wallet').members;
const Setting = require('app/model/wallet').settings;
const PointHistory = require('app/model/wallet').point_histories;
const MembershipType = require('app/model/wallet').membership_types;
const PointStatus = require("app/model/wallet/value-object/point-status");
const PointAction = require("app/model/wallet/value-object/point-action");
const database = require('app/lib/database').db().wallet;
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

        let [_, response] = await ExchangeTransaction.update({
          status: tStatusResult.result.toUpperCase()
        }, {
          where: {
            id: t.id
          },
          returning: true,
          plain: true
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

        if (tStatusResult.result.toUpperCase() == ExchangeTransactionStatus.FINISHED) {
          await _addPointToUser({
            member_id: response.member_id,
            object_id: response.id,
            amount_usd: response.estimate_amount_usd || 0
          });
        }
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

async function _addPointToUser({ member_id, object_id, amount_usd }) {
  let transaction;
  try {
    let member = await Member.findOne({
      where: {
        id: member_id
      }
    });
    if (!member || !member.membership_type_id) {
      return;
    }

    let membershipType = await MembershipType.findOne({
      where: {
        id: member.membership_type_id,
        deleted_flg: false
      }
    });
    if (!membershipType) {
      return;
    }

    let history = await PointHistory.findOne({
      where: {
        member_id: member_id,
        action: PointAction.EXCHANGE,
        object_id: object_id,
        status: {
          [Op.ne]: PointStatus.CANCELED
        }
      }
    });
    if (history) {
      return;
    }

    let setting = await Setting.findAll({
      where: {
        key: {
          [Op.in]: [
            "MS_POINT_EXCHANGE_IS_ENABLED",
            "MS_POINT_EXCHANGE_MININUM_VALUE_IN_USDT"
          ]
        }
      }
    });

    let enable = setting.findOne(x => x.key == "MS_POINT_EXCHANGE_IS_ENABLED");
    if (!enable || Boolean(enable.value) == false) {
      return;
    }

    let minimun = setting.findOne(x => x.key == "MS_POINT_EXCHANGE_MININUM_VALUE_IN_USDT");
    if (!minimun) {
      return;
    }
    minimun = parseFloat(minimun.value);
    if (amount_usd < minimun) {
      return;
    }

    let exchangeTransaction = await exchangeTransaction.findOne({
      where: {
        id: object_id
      }
    })

    transaction = await database.transaction();
    await PointHistory.create({
      member_id: member_id,
      amount: membershipType.exchange_points || 0,
      currency_symbol: "MS_POINT",
      status: PointStatus.APPROVED,
      action: PointAction.EXCHANGE,
      platform: exchangeTransaction.from_currency,
      source_amount: exchangeTransaction.amount_expected_from,
      tx_id: exchangeTransaction.tx_id,
      object_id: object_id
    }, transaction);

    await Member.increment({
      points: parseInt(membershipType.exchange_points || 0)
    }, {
      where: {
        id: member_id
      },
      transaction
    })
    transaction.commit();

    _sendNotification({
      member_id: member_id,
      amount: exchangeTransaction.amount_expected_from,
      platform: exchangeTransaction.from_currency,
      point: membershipType.exchange_points
    });

    return;
  }
  catch (err) {
    logger.error('_addPointToUser::', err);
    if (transaction) {
      transaction.rollback();
    }
  }
}

async function _sendNotification({ member_id, point, platform, amount }) {
  try {

  }
  catch (err) {
    logger.error(`point tracking _sendNotification::`, err);
  }
}