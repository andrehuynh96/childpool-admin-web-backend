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

      const allMemberLoginMonth = await MemberActivityLog.findAll({
        attributes: [
          [Sequelize.fn('date_trunc', 'day', Sequelize.col('created_at')), 'day'],
          [Sequelize.literal(`COUNT('member_id')`), 'count']],
        where: {
          created_at: {
            [Op.gte]: startMonth,
            [Op.lt]: endMonth
          },
          action: ActionType.LOGIN
        },
        group: ['day'],
        raw: true
      });

      const month = {
        totalMonth: totalMonth,
        items: allMemberLoginMonth
      };

      const allMemberLoginWeek = await MemberActivityLog.findAll({
        attributes: [
          [Sequelize.fn('date_trunc', 'day', Sequelize.col('created_at')), 'day'],
          [Sequelize.literal(`COUNT('member_id')`), 'count']],
        where: {
          created_at: {
            [Op.gte]: startWeek,
            [Op.lt]: endMonth
          },
          action: ActionType.LOGIN
        },
        group: ['day'],
        raw: true
      });

      const week = {
        totalMonth: totalMonth,
        items: allMemberLoginWeek
      };

      const allMemberLoginDay = await MemberActivityLog.findAll({
        attributes: [
          [Sequelize.fn('date_trunc', 'hour', Sequelize.col('created_at')), 'hour'],
          [Sequelize.literal(`COUNT('member_id')`), 'count']],
        where: {
          created_at: {
            [Op.gte]: startDay,
            [Op.lt]: endMonth
          },
          action: ActionType.LOGIN
        },
        group: ['hour'],
        raw: true
      });
      const day = {
        totalDay: totalDay,
        items: allMemberLoginDay
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

