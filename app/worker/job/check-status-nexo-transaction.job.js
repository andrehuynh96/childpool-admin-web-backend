const logger = require("app/lib/logger");
const CheckStatusNexoTransaction = require("../service/check-status-nexo-transaction/nexo");
const NexoMember = require('app/model/wallet').nexo_members;
const NexoTransaction = require('app/model/wallet').nexo_transactions;
const NexoTransactionStatus = require('app/model/wallet/value-object/nexo-transaction-status');
const NexoTransactionType = require('app/model/wallet/value-object/nexo-transaction-type');
const NexoMemberStatus = require('app/model/wallet/value-object/nexo-member-status')
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
              status: [NexoTransactionStatus.NEW,NexoTransactionStatus.PENDING]
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
          secret: item.user_secret
        };
      });

      const nexoWithdrawTransaction = await NexoTransaction.findAll({
        where: {
          type: NexoTransactionType.WITHDRAW,
          status: [NexoTransactionStatus.NEW,NexoTransactionStatus.PENDING]
        },
        raw: true
      });

      const nexoTransactionList = nexoWithdrawTransaction.map(item => item.nexo_transaction_id);
      console.log("🚀 ~ file: check-status-nexo-transaction.job.js ~ line 43 ~ execute: ~ nexoTransactionList", nexoTransactionList)

      let service = new CheckStatusNexoTransaction({ ibp: true });

      // for (let item of nexoAccount) {
      //   const result = await service.getWithdrawTransactions({ nexo_id: item.nexo_id, secret: item.secret });
      // }
    }
    catch (err) {
      logger.error("check status fiat transaction job error:", err);
    }
  }
};
