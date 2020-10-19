const logger = require('app/lib/logger');
const Setting = require('app/model/wallet').settings;
const MembershipType = require('app/model/wallet').membership_types;
const database = require('app/lib/database').db().wallet;
module.exports = {
  get: async (req, res, next) => {
    try {
      const settings = await Setting.findOne({
        where: {
          key: 'MS_POINT_DELAY_TIME_IN_SECONDS'
        }
      });
      const delayTime = settings.value;
      const membershipTypes = await MembershipType.findAll({
        attributes: ['name','claim_points'],
        where: {
          is_enabled: true
        },
        raw: true
      });

      const claimPoints = membershipTypes.reduce((result,value) => {
        result[value.name] = value.claim_points;
        return result;
      },{});
      const results = {
        claimPoints: claimPoints,
        delayTime: delayTime
      };

      return res.ok(results);
    }
    catch (error) {
      logger.info('get ms point settings fail',error);
      next();
    }
  },
  update: async (req, res, next) => {
    let transaction;
    try {
      const { delayTime, claimPoints } = req.body;
      const transaction = await database.transaction();
      await Setting.update({
        value: delayTime
      }, {
        where: {
          key: 'MS_POINT_DELAY_TIME_IN_SECONDS'
        },
        returning: true,
        transaction: transaction
      });
      for (let item in claimPoints) {
        await MembershipType.update({
          claim_points: claimPoints[item]
        },{
          where: {
            name: item
          },
          returning: true,
          transaction: transaction
        });
      }
      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      logger.info('update ms point settings fail',error);
      next();
    }
  }
};
