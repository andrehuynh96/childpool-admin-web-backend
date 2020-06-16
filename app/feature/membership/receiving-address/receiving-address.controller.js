const logger = require("app/lib/logger");
const config = require("app/config");
const database = require('app/lib/database').db().wallet;
const ReceivingAddress = require("app/model/wallet").receiving_addresses;
const Address = require("app/lib/address");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let results = await ReceivingAddress.findAll({
        where: {
        },
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
        return res.notFound();
      }

      return res.ok(result);
    }
    catch (err) {
      logger.error("get receiving addresses fail", err);
      next(err);
    }
  },

  active: async (req, res, next) => {
    try {
      let result = await ReceivingAddress.findOne({
        where: {
          id: req.params.id
        }
      });

      if (!result) {
        return res.notFound();
      }

      let [_, response] = await ReceivingAddress.update({
        actived_flg: true,
        updated_by: req.user.id,
      }, {
          where: {
            id: result.id
          },
          returning: true,
        });

      if (!response || response.length == 0) {
        return res.serverInternalError();
      }

      return res.ok(response[0]);
    }
    catch (err) {
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
        return res.notFound();
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

      if (!response || response.length == 0) {
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
        actived_flg: true,
        created_by: req.user.id
      })

      return res.ok(true);
    }
    catch (err) {
      logger.error("active receiving addresses fail", err);
      next(err);
    }
  },
}