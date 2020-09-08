const logger = require('app/lib/logger');
const MemberAssets = require('app/model/wallet').member_assets;
const Member = require('app/model/wallet').members;
const Wallet = require('app/model/wallet').wallets;
const WalletPrivKey = require('app/model/wallet').wallet_priv_keys;
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;

      const where = {};
      const memberCond = {};
      let fromDate, toDate;

      if (query.from_date || query.to_date) {
        where.created_at = {};
      }
      if (query.from_date) {
        fromDate = moment(query.from_date).toDate();
        where.created_at[Op.gte] = fromDate;
      }

      if (query.to_date) {
        toDate = moment(query.to_date).add(1, 'minute').toDate();
        where.created_at[Op.lt] = toDate;
      }

      if (fromDate && toDate && fromDate >= toDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
      }

      if (query.email || query.address) {
        where.address = {};
      }

      if (query.email) {
        memberCond.email = { [Op.iLike]: `%${query.email}%` };
        const members = await Member.findAll({
          where: memberCond
        });

        const memberIds = members.map(item => item.id);
        const wallets = await Wallet.findAll({
          where: {
            member_id: memberIds
          }
        });
        const walletIds = wallets.map(item => item.id);
        const walletPrivKeys = await WalletPrivKey.findAll({
          where: {
            wallet_id: walletIds
          }
        });

        if (walletPrivKeys.length == 0) {
          return res.ok({
            items: [],
            offset: offset,
            limit: limit,
            total: 0
          });
        }
        const addressList = walletPrivKeys.map(item => item.address);
        where.address[Op.in] = addressList;
      }

      if (query.address) {
        where.address[Op.iLike] = `%${query.address}%`;
      }

      if (query.platform) {
        where.platform = query.platform;
      }

      const { count: total, rows: items } = await MemberAssets.findAndCountAll({
        limit,
        offset,
        where: where,
        order: [['created_at', 'DESC']]
      });

      return res.ok({
        items: items.length > 0 ? items : [],
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (error) {
      logger.error('search member asset fail', error);
      next(error);
    }
  }
};
