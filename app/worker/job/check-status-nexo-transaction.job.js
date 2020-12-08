const logger = require("app/lib/logger");
const CheckStatusNexoTransaction = require("../service/check-status-nexo-transaction/nexo");
const NexoMember = require('app/model/wallet').nexo_members;
const NexoTransaction = require('app/model/wallet').nexo_transactions;
const NexoTransactionStatus = require('app/model/wallet/value-object/nexo-transaction-status');
const NexoTransactionType = require('app/model/wallet/value-object/nexo-transaction-type');
const NexoMemberStatus = require('app/model/wallet/value-object/nexo-member-status');
module.exports = {
  execute: async () => {
    try {
      const nexoMembers = await NexoMember.findAll({
        include: [
          {
            attributes: ['nexo_id','nexo_transaction_id'],
            as: "NexoTransaction",
            model: NexoTransaction,
            where: {
              type: NexoTransactionType.WITHDRAW,
              status: [NexoTransactionStatus.PENDING]
            },
            required: true,
          }
        ],
        where: {
          status: NexoMemberStatus.ACTIVATED
        }
      });

      const nexoAccounts = nexoMembers.map(item => {
        return {
          nexo_id: item.nexo_id,
          secret: item.user_secret,
        };
      });

      const nexoTransaction = await NexoTransaction.findAll({
        where: {
          type: NexoTransactionType.WITHDRAW,
          status: [NexoTransactionStatus.PENDING]
        }
      });
      const nexoTransactionIds = nexoTransaction.map(item => item.nexo_transaction_id);
      let service = new CheckStatusNexoTransaction({ ibp: true });
      console.log(nexoTransactionIds);
      for (let item of nexoAccounts) {
        const result = await service.getWithdrawTransactions({ nexo_id: item.nexo_id, secret: item.secret });
        console.log(result);
        for (let tx_id of nexoTransactionIds) {
          const tx = result.find(x => x.id === tx_id);
          if (tx && tx.status !== NexoTransactionStatus.PENDING.toLowerCase()) {
            logger.info('Update nexo transaction: ',tx.id);
            await NexoTransaction.update({
              status: tx.status.toUpperCase()
            },{
              where: {
                nexo_transaction_id: tx.id
              }
            });
          }
        }
      }
    }
    catch (err) {
      logger.error("check status fiat transaction job error:", err);
    }
  }
};
