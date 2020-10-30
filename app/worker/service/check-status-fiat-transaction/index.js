const logger = require('app/lib/logger');
const FiatFactory = require('./factory');
const FiatProvider = require('./provider');
const FiatTransaction = require('app/model/wallet').fiat_transactions;
const TransactionStatus = require('app/model/wallet/value-object/fiat-transaction-status');

class CheckStatusFiatTransaction {
  constructor() {
  }

  async check() {
    try {
      const Service = FiatFactory.create(FiatProvider.Wyre, {});
      let transactions = await FiatTransaction.findAll({
        where: {
          status: TransactionStatus.PROCESSING
        }
      });
      if (transactions && transactions.length > 0) {
        for (let e of transactions) {
          let result = await Service.getOrder({orderId : e.order_id});
          let data = {
            status: result.status,
            from_amount: result.sourceAmount,
            transaction_id: result.transferId,
            payment_method_name: result.paymentMethodName,
            order_type: result.orderType
          }
          if (result.transferId) {
            let transaction = await Service.getTransaction({transferId: result.transferId});
            if (transaction) {
              data.tx_id = transaction.blockchainNetworkTx;
              data.rate = transaction.rate;
              data.to_amount = transaction.destAmount;
              data.fee_currency = transaction.feeCurrency;
              data.message = transaction.message;
              data.fees = transaction.fees;
              data.total_fee = transaction.fee;
              data.response = JSON.stringify(transaction)
            }
          } 
          await FiatTransaction.update(data, {
            where: {
              id: e.id
            }
          }) 
        }
      }
    } catch (err) {
      logger.error('Service check transaction failed', err)
    }
  }
}

module.exports = CheckStatusFiatTransaction;