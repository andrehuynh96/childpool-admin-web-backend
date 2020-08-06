const logger = require("app/lib/logger");
const database = require('app/lib/database').db().wallet;
const BankAccount = require("app/model/wallet").bank_accounts;

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;
      const { count: total, rows: items } = await BankAccount.findAndCountAll({
        limit,
        offset,
        order: [['created_at', 'DESC']]
    });
    return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
    });
    }
    catch (err) {
      logger.error("get all bank account fail", err);
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      let current = await BankAccount.findOne({
        where: {
          actived_flg: true
        },
        order: [['created_at', 'DESC']]
      });

      if (!current) {
        let i = new BankAccount();
        return res.ok(i);
      }

      return res.ok(current);
    }
    catch (err) {
      logger.error("get bank account fail", err);
      next(err);
    }
  },
  update: async (req, res, next) => {
    let transaction;
    try {
      let current = await BankAccount.findOne({
        where: {
          actived_flg: true,
          bank_name: req.body.bank_name,
          branch_name: req.body.branch_name,
          account_name: req.body.account_name,
          account_number: req.body.account_number,
          currency_symbol: req.body.currency_symbol,
          account_type: req.body.account_type,
          memo: req.body.memo
        }
      });
      if (current) {
        return res.ok(true);
      }

      transaction = await database.transaction();
      let updateCurrent = await BankAccount.update({
        updated_by: req.user.id,
        actived_flg: false
      }, {
        where: {
          actived_flg: true,
        },
        returning: true,
        transaction: transaction
      });
      if (!updateCurrent) {
        if (transaction) {
          await transaction.rollback();
        }
        return res.serverInternalError();
      }

      let result = await BankAccount.create({
        created_by: req.user.id,
        actived_flg: true,
        bank_name: req.body.bank_name,
        branch_name: req.body.branch_name,
        account_name: req.body.account_name,
        account_number: req.body.account_number,
        currency_symbol: req.body.currency_symbol,
        account_type: req.body.account_type,
        memo: req.body.memo
      }, { transaction });

      if (!result) {
        if (transaction) {
          await transaction.rollback();
        }
        return res.serverInternalError();
      }

      await transaction.commit();
      return res.ok(true);
    }
    catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error("update bank account fail", err);
      next(err);
    }
  }
};