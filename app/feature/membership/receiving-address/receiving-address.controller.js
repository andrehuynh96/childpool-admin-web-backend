const logger = require("app/lib/logger");
const database = require('app/lib/database').db().wallet;
const ReceivingAddress = require("app/model/wallet").receiving_addresses;
const Address = require("app/lib/address");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let where = {};
      let currency_symbol = req.query.currency_symbol;
      if (currency_symbol)
        where.currency_symbol = currency_symbol.toUpperCase();
      let results = await ReceivingAddress.findAll({
        where,
        order: [['created_at', 'DESC']]
      });

      if (!results || results.length == 0) {
        return res.ok([]);
      }

      return res.ok(results);
    }
    catch (err) {
      logger.error("get receiving addresses fail", err);
      next(err);
    }
  },

  get: async (req, res, next) => {
    try {
      let result = await ReceivingAddress.findOne({
        where: {
          id: req.params.id
        }
      });

      if (!result) {
        return res.badRequest(res.__("RECEIVING_ADDRESS_NOT_FOUND"), "RECEIVING_ADDRESS_NOT_FOUND", { field: ['id'] });
      }

      return res.ok(result);
    }
    catch (err) {
      logger.error("get receiving addresses fail", err);
      next(err);
    }
  },

  active: async (req, res, next) => {
    let transaction;
    try {
      transaction = await database.transaction();
      let result = await ReceivingAddress.findOne({
        where: {
          id: req.params.id
        }
      });

      if (!result) {
        return res.badRequest(res.__("RECEIVING_ADDRESS_NOT_FOUND"), "RECEIVING_ADDRESS_NOT_FOUND", { field: ['id'] });
      }

      let responseAllUpdate = await ReceivingAddress.update({
        actived_flg: false,
        updated_by: req.user.id,
      }, {
        where: {
          currency_symbol: result.currency_symbol
        },
        returning: true,
        transaction: transaction
      });
      if (!responseAllUpdate) {
        return res.serverInternalError();
      }
      let [_, response] = await ReceivingAddress.update({
        actived_flg: true,
        updated_by: req.user.id,
      }, {
        where: {
          id: result.id
        },
        returning: true,
        transaction: transaction
      });

      if (!response) {
        return res.serverInternalError();
      }
      await transaction.commit();
      return res.ok(response[0]);
    }
    catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error("active receiving addresses fail", err);
      next(err);
    }
  },

  disable: async (req, res, next) => {
    try {
      let result = await ReceivingAddress.findOne({
        where: {
          id: req.params.id
        }
      });

      if (!result) {
        return res.badRequest(res.__("RECEIVING_ADDRESS_NOT_FOUND"), "RECEIVING_ADDRESS_NOT_FOUND", { field: ['id'] });
      }

      let [_, response] = await ReceivingAddress.update({
        actived_flg: false,
        updated_by: req.user.id,
      }, {
        where: {
          id: result.id
        },
        returning: true,
      });

      if (!response) {
        return res.serverInternalError();
      }

      return res.ok(response[0]);
    }
    catch (err) {
      logger.error("disable receiving addresses fail", err);
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {

      let result = await ReceivingAddress.findOne({
        where: {
          currency_symbol: req.body.platform,
          wallet_address: req.body.address,
        }
      });
      if (result) {
        return res.badRequest(res.__("CREATE_ALREADY"), "CREATE_ALREADY", { fields: ['platform', 'address'] });
      }
      let validateAddress = Address.validate(req.body.platform, req.body.address);
      if (!validateAddress) {
        return res.badRequest(res.__("INVALID_ADDRESS"), "INVALID_ADDRESS", { fields: ['address'] });
      }

      await ReceivingAddress.create({
        currency_symbol: req.body.platform,
        wallet_address: req.body.address,
        description: req.body.description,
        actived_flg: true,
        created_by: req.user.id
      });

      return res.ok(true);
    }
    catch (err) {
      logger.error("active receiving addresses fail", err);
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
        let result = await ReceivingAddress.findOne({
          where: {
            id: req.params.id
          }
        });

        if (!result) {
          return res.badRequest(res.__("RECEIVING_ADDRESS_NOT_FOUND"), "RECEIVING_ADDRESS_NOT_FOUND", { field: ['id'] });
        }

        await ReceivingAddress.update({
          description: req.body.description,
          updated_by: req.user.id,
        }, {
          where: {
            id: result.id
          },
          returning: true,
        });

        return res.ok(true);
    } catch (error) {
      logger.error("update receiving addresses memo fail", error);
      next(error);
    }
  }
};