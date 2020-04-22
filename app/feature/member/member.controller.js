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

module.exports = {
  search: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let where = {
        deleted_flg: false
      };

      let criteria = [];
      if (req.query.member_sts) where.member_sts = req.query.member_sts;
      if (req.query.email) criteria.push({ email: { [Op.iLike]: `%${req.query.email}%` } });
      if (req.query.address) criteria.push({ address: { [Op.iLike]: `%${req.query.address}%` } });
      if (req.query.fullname) criteria.push({ fullname: { [Op.iLike]: `%${req.query.fullname}%` } });
      if (req.query.phone) criteria.push({ phone: req.query.phone });
      if (criteria.length > 0) where[Op.or] = criteria;

      const { count: total, rows: items } = await Member.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'DESC']] });
      console.log(userMapper(items))
      return res.ok({
        items: userMapper(items) && userMapper(items).length>0?userMapper(items):[],
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('search member fail:', err);
      next(err);
    }
  }
}