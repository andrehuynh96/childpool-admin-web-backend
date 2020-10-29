const logger = require('app/lib/logger');
const moment = require('moment');
const _ = require('lodash');
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require("app/model/wallet/value-object/member-activity-action-type");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = {
  get: async (req, res, next) => {
    try {
      const endMonth = moment.utc().endOf('day');
      const startMonth = moment(endMonth).subtract(29,'day').startOf('day');
      const startWeek = moment(endMonth).subtract(6,'day').startOf('day');
      const startDay = moment(endMonth).subtract(24,'hour');

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

      const loginsWeek = await MemberActivityLog.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('member_id')), 'member_id']],
        where: {
          created_at: {
            [Op.gte]: startWeek,
            [Op.lt]: endMonth
          },
          action: ActionType.LOGIN
        },
      });

      const loginsDay = await MemberActivityLog.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('member_id')), 'member_id']],
        where: {
          created_at: {
            [Op.gte]: startDay,
            [Op.lt]: endMonth
          },
          action: ActionType.LOGIN
        },
      });

      const totalMonth = loginsMonth.length;
      const totalWeek = loginsWeek.length;
      const totalDay = loginsDay.length;

      const allMemberLoginMonth = await MemberActivityLog.count({
        where: {
          created_at: {
            [Op.gte]: startMonth,
            [Op.lt]: endMonth
          },
          action: ActionType.LOGIN
        },
        group: ['created_at']
      });

      allMemberLoginMonth.forEach(item => {
        item.created_at = moment(item.created_at).format('YYYY-MM-DD');
      });

      const dayOfMonth = allMemberLoginMonth.map(item => item.created_at);
      const uniqDayOfMonth = _.uniq(dayOfMonth).sort();

      const resultOfMonth = countLoginEachTimes(allMemberLoginMonth,uniqDayOfMonth);

      const month = {
        totalMonth: totalMonth,
        items: resultOfMonth
      };

      const allMemberLoginWeek = [];
      const dayOfStartWeek = moment(startWeek).format('YYYY-MM-DD');
      const dayOfWeek = [];
      uniqDayOfMonth.forEach(item => {
        if (item >= dayOfStartWeek) {
          dayOfWeek.push(item);
        }
      });

      const resultOfWeek = countLoginEachTimes(allMemberLoginMonth,dayOfWeek);
      const week = {
        totalWeek: totalWeek,
        resultOfWeek: resultOfWeek
      };

      const allMemberLoginDay = await MemberActivityLog.count({
        where: {
          created_at: {
            [Op.gte]: startDay,
            [Op.lt]: endMonth
          },
          action: ActionType.LOGIN
        },
        group: ['created_at']
      });

      allMemberLoginDay.forEach(item => {
        item.created_at = moment(item.created_at).format('YYYY-MM-DD HH:00');
      });
      const hourOfDay = allMemberLoginDay.map(item => item.created_at);
      const uniqHourOfDay = _.uniq(hourOfDay).sort();

      const resultOfDay = countLoginEachTimes(allMemberLoginDay,uniqHourOfDay);

      const day = {
        totalDay: totalDay,
        items: resultOfDay
      };

      return res.ok({
        month: month,
        week: week,
        day: day
      });
    }
    catch (error) {
      logger.error('Get member login chart fail',error);
    }
  }
};

function countLoginEachTimes(allLogin,times) {
  const result = {};
  times.forEach(item => {
    result[item] = 0;
    allLogin.forEach(x => {
      if (x.created_at === item) {
        result[item] += parseInt(x.count);
      }
    });
  });
  return result;
}
