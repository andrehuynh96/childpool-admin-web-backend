const logger = require('app/lib/logger');
const moment = require('moment');
const _ = require('lodash');
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require("app/model/wallet/value-object/member-activity-action-type");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports = {
  get: async (req,res,next) => {
    try {
      const endMonth = moment.utc().endOf('day');
      const startMonth = moment(endMonth).subtract(30,'day');
      const where = {
        created_at: {
          [Op.gte]: startMonth,
          [Op.lt]: endMonth
        },
        action: ActionType.LOGIN
      };

      const memberLogins = await MemberActivityLog.findAll({
        attributes: ['member_id','created_at'],
        where: where,
        order: [['created_at','DESC']],
        raw: true
      });
      const memberLoginMonth = countDataMonthTo30Day(memberLogins,startMonth,endMonth);

      return res.ok(memberLoginMonth);
    }
    catch (error) {
      logger.error('Get member login chart fail',error);
    }
  }
};

function countDataDayTo24Hour() {
  return [];
}

function countMonthAndWeek(memberLoggins,startMonth,endMonth) {
  const members = memberLoggins.map(item => item.member_id);
  const totalMonth = _.uniq(members);
  // const result = [];

  const cache = memberLoggins.reduce((result,value) => {
    const day = moment(value.created_at).format('YYYY-MM-DD');
    result[day] = value.member_id;
  },[]);
  console.log(cache);

  return {
    totalMonth: totalMonth
  };
}
