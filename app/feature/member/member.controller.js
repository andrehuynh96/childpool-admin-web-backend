const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const userMapper = require("app/feature/response-schema/user.response-schema");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const config = require("app/config");
const database = require('app/lib/database').db().wallet;
const Role = require("app/model/wallet").roles;
const UserRole = require("app/model/wallet").user_roles;
const MembershipApi = require("app/lib/membership-api");

module.exports = {
  search: async (req, res, next) => {
    try {
      // let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      // let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      // let where = {
      //   deleted_flg: false
      // };

      // let criteria = [];
      // if (req.query.member_sts) where.member_sts = req.query.member_sts;
      // if (req.query.email) criteria.push({ email: { [Op.iLike]: `%${req.query.email}%` } });
      // if (req.query.address) criteria.push({ address: { [Op.iLike]: `%${req.query.address}%` } });
      // if (req.query.fullname) criteria.push({ fullname: { [Op.iLike]: `%${req.query.fullname}%` } });
      // if (req.query.phone) criteria.push({ phone: req.query.phone });
      // if (criteria.length > 0) where[Op.or] = criteria;

      // const { count: total, rows: items } = await Member.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'DESC']] });      
      // return res.ok({
      //   items: userMapper(items) && items.length>0?userMapper(items):[],
      //   offset: offset,
      //   limit: limit,
      //   total: total
      // });
      // let items = await MembershipApi.searchMember(req.query);
      // if (!items.code) {
      //   return res.ok(items.data);
      // }
      // else {
      //   return res.status(parseInt(items.code)).send(items.data);
      // }

      let data = {
        items : [
          {
            id: '1',
            name: 'User1',
            membership_type: 'Free',
            kyc_level: 'KYC 1',
            kyc_status: 'Approved',
            referral_code: '0FA2MN',
            referrer: '',
            create_at: '2020-03-04 19:44:44.194+09'
          },
          {
            id: '2',
            name: 'User2',
            membership_type: 'Paid',
            kyc_level: 'KYC 1',
            kyc_status: 'Approved',
            referral_code: '1FE2MK',
            referrer: '0FA2MN',
            create_at: '2020-04-29 15:15:51.676+09'
          }
        ],
        total : 2,
        limit : 10,
        offset : 0,
      }
      console.log(data.items);
      return res.ok(data);
    }
    catch (err) {
      logger.error('search member fail:', err);
      next(err);
    }
  }
}