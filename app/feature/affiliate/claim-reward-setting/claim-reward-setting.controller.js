const logger = require("app/lib/logger");
const database = require('app/lib/database').db().wallet;
const Setting = require("app/model/wallet").settings;
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const REWARD_PAYOUT_MIN_PROPERTIES_MAPPING = {
  'claim_affiliate_reward_atom': 'CLAIM_AFFILIATE_REWARD_ATOM',
  'claim_affiliate_reward_iris': 'CLAIM_AFFILIATE_REWARD_IRIS',
  'claim_affiliate_reward_ong': 'CLAIM_AFFILIATE_REWARD_ONG',
  'claim_affiliate_reward_one': 'CLAIM_AFFILIATE_REWARD_ONE',
  'claim_affiliate_reward_xtz': 'CLAIM_AFFILIATE_REWARD_XTZ',
};

module.exports = {
  get: async (req, res, next) => {
    try {
      const settings = await Setting.findAll({
        where: {
          key: {
            [Op.in]: Object.values(REWARD_PAYOUT_MIN_PROPERTIES_MAPPING),
          }
        }
      });
      const data = {};

      Object.keys(REWARD_PAYOUT_MIN_PROPERTIES_MAPPING).forEach(propertyName => {
        data[propertyName] = 0;

        const setting = settings.find(item => item.key === REWARD_PAYOUT_MIN_PROPERTIES_MAPPING[propertyName]);
        if (setting && setting.value) {
          try {
            data[propertyName] = parseFloat(setting.value);
          } catch (error) {
            logger.error(error);
          }
        }
      });

      return res.ok(data);
    }
    catch (err) {
      logger.error("get claim affiliate reward setting", err);
      next(err);
    }
  },
  update: async (req, res, next) => {
    let transaction = await database.transaction();

    try {
      for (let propertyName of Object.keys(req.body)) {
        const key = REWARD_PAYOUT_MIN_PROPERTIES_MAPPING[propertyName];
        // eslint-disable-next-line no-unused-vars
        const [numOfItems, setting] = await Setting.update({
          value: req.body[propertyName],
          updated_by: req.user.id
        }, {
          where: {
            key,
          },
          returning: true,
          transaction: transaction
        });

        if (!numOfItems) {
          await Setting.create({
            key,
            property: propertyName,
            value: req.body[propertyName],
            type: "number",
            created_by: req.user.id,
            updated_by: req.user.id,
          }, {
            transaction: transaction
          });
        }
      }

      await transaction.commit();

      return res.ok(true);
    }
    catch (err) {
      logger.error("update claim affiliate reward setting fail", err);
      await transaction.rollback();

      next(err);
    }
  }
};