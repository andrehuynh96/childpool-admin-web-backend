const logger = require('app/lib/logger');
const database = require('app/lib/database').db().wallet;

module.exports = {
  getTopAffiliate: async (req, res, next) => {
    try {
      let sql = `
      select m.* from (
        SELECT a.id, a.referrer_code, a.referral_code, a.email,a.created_at,
        (SELECT count(*) from members where members.referrer_code  = a.referral_code) as num_of_refers
        FROM members as a
        where a.referral_code is not null and a.referral_code <> ''
      ) as m
      order by m.num_of_refers desc
      limit 10
      offset 0
      `;

      var result = await database.query(sql, { type: database.QueryTypes.SELECT });
      return res.ok({
        items: result.length > 0 ? result : [],
      });
    }
    catch (error) {
      logger.info('get top affiliate list fail', error);
      next(error);
    }
  },
};

