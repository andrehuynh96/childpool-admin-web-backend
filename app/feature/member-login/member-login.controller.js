const logger = require('app/lib/logger');
const moment = require('moment');
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require("app/model/wallet/value-object/member-activity-action-type");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = {
  get: async (req, res, next) => {
    try {
      const today = moment.utc();
      const startDay = today.clone().subtract(24,'hour').startOf('hour');
      const endDay = today.clone();

      const startWeek = today.clone().subtract(7,'day').startOf('day');
      const endWeek = today.clone();

      const startMonth = today.clone().subtract(30,'day').startOf('day');
      const endMonth = today.clone();

      const startThreeMonth = today.clone().subtract(90,'day').startOf('day');
      const endThreeMonth = today.clone();

      const loginsDay = await MemberActivityLog.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('member_id')), 'member_id']],
        where: {
          created_at: {
            [Op.gte]: startDay,
            [Op.lt]: endDay
          },
          action: ActionType.LOGIN
        },
      });

      const loginsWeek = await MemberActivityLog.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('member_id')), 'member_id']],
        where: {
          created_at: {
            [Op.gte]: startWeek,
            [Op.lt]: endWeek
          },
          action: ActionType.LOGIN
        },
      });

      const loginsMonth = await MemberActivityLog.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('member_id')), 'member_id']],
        where: {
          created_at: {
            [Op.gte]: startMonth,
            [Op.lt]: endMonth
          },
          action: ActionType.LOGIN
        },
      });

      const logins90Day = await MemberActivityLog.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('member_id')), 'member_id']],
        where: {
          created_at: {
            [Op.gte]: startThreeMonth,
            [Op.lt]: endThreeMonth
          },
          action: ActionType.LOGIN
        },
      });

      const totalThreeMonth = logins90Day.length;
      const totalMonth = loginsMonth.length;
      const totalWeek = loginsWeek.length;
      const totalDay = loginsDay.length;



      return res.ok({
        three_month: totalThreeMonth,
        month: totalMonth,
        week: totalWeek,
        day: totalDay
      });
    }
    catch (error) {
      logger.error('Get member login chart fail',error);
    }
  }
};

