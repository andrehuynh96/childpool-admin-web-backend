const logger = require("app/lib/logger");
const config = require("app/config");
const InfinitoApi = require('node-infinito-api');
const TransactionStatus = require("app/model/wallet/value-object/member-distribute-reward-status");
const MemberDistributeReward = require("app/model/wallet").member_distribute_reward_his;

class BaseCheckTransactionDistributeReward {
  constructor(transaction) {
    this.transaction = transaction;
    const opts = {
      apiKey: config.sdk.apiKey,
      secret: config.sdk.secretKey,
      baseUrl: config.sdk.baseUrl
    };
    const api = new InfinitoApi(opts);
    this.service = api;
  }
  async check() {
    try {
      let confirmationBlock = config.txCreator[this.transaction.currency_symbol].confirmBlock;

      let transaction = await _checkTransaction[this.transaction.currency_symbol](this.service, this.transaction.tx_id);
      if (transaction.success) {
        let latestBlockHeight = await _currentBlockHeight[this.transaction.currency_symbol](this.service);
        var confirmedBlockNumber = latestBlockHeight - transaction.block_height;
        if (confirmedBlockNumber >= confirmationBlock) {
          await this._updateTransaction({
            status: TransactionStatus.CONFIRMED,
            transaction_log: transaction.transaction_log,
            id: this.transaction.id
          })
        }
      }
      else {
        await this._updateTransaction({
          status: TransactionStatus.CANCELED,
          transaction_log: transaction.transaction_log,
          id: this.transaction.id
        })
      }
    }
    catch (err) {
      logger.error(`${this.platform}: check transaction distribute reward to member fail:`, err);
    }
  }

  async _updateTransaction(data) {
    await MemberDistributeReward.update(
      {
        status: data.status,
        transaction_log: data.transaction_log
      },
      {
        where: { id: data.id }
      });
  }
}

module.exports = BaseCheckTransactionDistributeReward;


const _checkTransaction = {
  IRIS: async (service, txId) => {
    let transaction = await service.IRIS.getTransaction(txId);
    if (transaction.cd != 0) {
      throw transaction;
    }

    return {
      success: transaction.data.result.Code == 0,
      transaction_log: transaction.data.result.Log,
      block_height: transaction.data.height,
    }
  },
  ATOM: async (service, txId) => {
    let transaction = await service.ATOM.getTransaction(txId);
    if (transaction.cd != 0) {
      throw transaction;
    }
    return {
      success: transaction.data.logs[0].success,
      transaction_log: transaction.data.logs[0].log,
      block_height: transaction.data.height,
    }
  },
  ONT: async (service, txId) => {
    const rest = new RestClient(config.ONT.restUrl);
    let transaction = await rest.getRawTransactionJson(txId);
    return {
      success: transaction.Error == 0,
      transaction_log: JSON.stringify(transaction),
      block_height: transaction.Result.Height,
    }
  },
}

const _currentBlockHeight = {
  IRIS: async (service) => {
    let currentBlock = await service.IRIS.sync();
    if (currentBlock.cd != 0) {
      throw currentBlock;
    }
    return parseInt(currentBlock.data.header.height);
  },
  ATOM: async (service) => {
    let currentBlock = await service.ATOM.sync();
    if (currentBlock.cd != 0) {
      throw currentBlock;
    }
    return parseInt(currentBlock.data.header.height);
  },
  ONT: async (service) => {
    const rest = new RestClient(config.ONT.restUrl);
    const currentBlock = await rest.getBlockHeight();
    if (currentBlock.Error == 0) {
      return parseInt(currentBlock.Result);
    }
    throw currentBlock;
  }
} 