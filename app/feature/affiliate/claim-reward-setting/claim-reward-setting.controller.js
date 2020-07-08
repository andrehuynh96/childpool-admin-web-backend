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
        claim_affiliate_reward_atom: 0,
        claim_affiliate_reward_iris: 0,
        claim_affiliate_reward_ong: 0
      };
      for (let e of results) {
        if (e.key == 'CLAIM_AFFILIATE_REWARD_ATOM') {
          data.claim_affiliate_reward_atom = JSON.parse(e.value);
        } else if (e.key == 'CLAIM_AFFILIATE_REWARD_IRIS') {
          data.claim_affiliate_reward_iris = JSON.parse(e.value);
        } else if (e.key == 'CLAIM_AFFILIATE_REWARD_ONG') {
          data.claim_affiliate_reward_ong = JSON.parse(e.value);
        } 
      }
      return res.ok(data);
    }
    catch (err) {
      logger.error("get claim affiliate reward setting", err);
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
      logger.error("update claim affiliate reward setting fail", err);
      next(err);
    }
  }
};