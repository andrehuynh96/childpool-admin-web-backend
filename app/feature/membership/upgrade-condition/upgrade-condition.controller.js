const logger = require("app/lib/logger");
const database = require('app/lib/database').db().wallet;
const Setting = require("app/model/wallet").settings;

module.exports = {
  get: async (req, res, next) => {
    try {
      let results = await Setting.findAll();
      if (!results || results.length == 0) {
        return res.ok({});
      }
      let data = {
        allow_upgrade_flg: true,
        num_of_paid_members: 0,
        num_of_free_members: 0,
        staking_amount: 0,
        staking_amount_currency_symbol: "USD",
        staking_reward: 0,
        staking_reward_currency_symbol: "USD"
      };
      for (let e of results) {
        if (e.key == 'ALLOW_UPGRADE_FLG') {
          data.allow_upgrade_flg = JSON.parse(e.value);
        } else if (e.key == 'NUM_OF_PAID_MEMBERS') {
          data.num_of_paid_members = parseInt(e.value);
        } else if (e.key == 'NUM_OF_FREE_MEMBERS') {
          data.num_of_free_members = parseInt(e.value);
        } else if (e.key == 'STAKING_AMOUNT') {
          data.staking_amount = JSON.parse(e.value);
        } else if (e.key == 'STAKING_AMOUNT_CURRENCY_SYMBOL') {
          data.staking_amount_currency_symbol = e.value;
        } else if (e.key == 'STAKING_REWARD') {
          data.staking_reward = JSON.parse(e.value);
        } else if (e.key == 'STAKING_REWARD_CURRENCY_SYMBOL') {
          data.staking_reward_currency_symbol = e.value;
        }
      }
      return res.ok(data);
    }
    catch (err) {
      logger.error("get upgrade condition fail", err);
      next(err);
    }
  },

  update: async (req, res, next) => {
    let transaction;
    try {
      transaction = await database.transaction();
      for (let key of Object.keys(req.body)) {
        await Setting.update({
          value: req.body[key],
          updated_by: req.user.id
        }, {
          where: {
            property: key
          },
          returning: true,
          transaction: transaction
        });

      }
      await transaction.commit();
      return res.ok(true);
    }
    catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error("update upgrade condition fail", err);
      next(err);
    }
  }
};