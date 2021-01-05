const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const database = require('app/lib/database').db().wallet;
const { forEach } = require('p-iteration');

module.exports = {
  getTopAffiliate: async (req, res, next) => {
    try {
      const { params, query } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const member = await Member.findOne({
        where: {
          id: params.memberId,
        },
      });
      if (!member) {
        return res.notFound(res.__("MEMBER_NOT_FOUND"), "MEMBER_NOT_FOUND", { fields: ["memberId"] });
      }

      let sql = `WITH RECURSIVE tmp
      AS (SELECT a.id,
                 a.referrer_code,
                 a.referral_code
          FROM members a
          WHERE referral_code = '${member.referral_code}'
          UNION ALL
          SELECT a.id,
                 a.referrer_code,
                 a.referral_code
          FROM members a
              JOIN tmp c
                  ON a.referrer_code = c.referral_code)
      SELECT referrer_code,count(*) as count_reff
      FROM tmp
      where referrer_code != '${member.referral_code}'
      group by referrer_code
      ORDER BY count_reff desc
      limit ${limit}
      offset ${offset}
      `;

      let result = [];
      var rs = await database.query(sql, { type: database.QueryTypes.SELECT });
      await forEach(rs, async item => {
        const data = await Member.findOne({
          where: { referral_code: item.referrer_code },
        });
        result.push({
          id: data.id,
          email: data.email,
          fullname: data.fullname,
          last_name: data.last_name,
          first_name: data.first_name,
          number_of_refferral: parseInt(item.count_reff),
          referrer_code: data.referrer_code,
          referral_code: data.referral_code,
          create_at: data.createdAt
        });
      });

      return res.ok({
        items: result.sort(function (a, b) { return a.count_reff - b.count_reff; }),
        offset: offset,
        limit: limit,
      });
    }
    catch (error) {
      logger.info('get top affiliate list fail', error);
      next(error);
    }
  },
};

