const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const MembershipOrder = require("app/model/wallet").membership_orders;
const MembershipType = require("app/model/wallet").membership_types;
// const memberMapper = require("app/feature/response-schema/member.response-schema");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const where = {
      };
      const memberWhere = {
        deleted_flg: false
      };
      
      if (query.order_id) where.id = query.order_id;
      if (query.payment_status) where.status = query.payment_status;
      if (query.bank_account_number) where.account_number = query.bank_account_number
      if (query.crypto_receive_address) where.wallet_address = query.crypto_receive_address
      if (query.email ) memberWhere.email = query.email
      if (query.from) where.created_at = {[Op.gte]: new Date(query.from)}
      if (query.to) where.created_at = {[Op.lte]: new Date(query.to)}
      if (query.membership_type_id) where.membership_type_id = query.membership_type_id
      
      const { count: total, rows: items } = await MembershipOrder.findAndCountAll(
        { 
          limit, 
          offset, 
          include: [
            {
              attributes: ['email', 'fullname', 'kyc_level', 'kyc_status', 'phone', 'city'],
              as: "Member",
              model: Member,
              where: memberWhere,
              required: true
            },
            {
              attributes: ['name', 'price', 'currency_symbol', 'type'],
              as: "MembershipType",
              model: MembershipType,
              required: true
            }
          ],
          where: where, 
          order: [['created_at', 'DESC']] 
        }
      );
    
      return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('search order fail:', err);
      next(err);
    }
  },
  getOrderDetail: async (req, res, next) => {
    try {
      const { params } = req;
      console.log(params.id);
      const memberWhere = {
        deleted_flg: false
      };
  
      const membershipOrder = await MembershipOrder.findOne(
        {
          include:[
            {
              attributes: ['email', 'fullname', 'kyc_level', 'kyc_status', 'phone', 'city'],
              as: "Member",
              model: Member,
              where: memberWhere,
              required: true
            },
            {
              attributes: ['name', 'price', 'currency_symbol', 'type'],
              as: "MembershipType",
              model: MembershipType,
              required: true
            }
          ],
          where: {
            id: params.id
          }
        });
      if (!membershipOrder) {
        return res.badRequest(res.__("MEMBERSHIPORDER_NOT_FOUND"), "MEMBERSHIPORDER_NOT_FOUND", { fields: ["id"] });
      }
      return res.ok(membershipOrder);
    }
    catch (error) {
      logger.error('get membership order detail fail:', error);
      next(error);
    }
  },
  approveOrder: async (req, res, next) => {

  }
}