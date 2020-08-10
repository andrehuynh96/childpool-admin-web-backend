const logger = require("app/lib/logger");
const Wallet = require("app/model/wallet").wallets;
const WalletPrivateKey = require("app/model/wallet").wallet_priv_keys;
const Member = require("app/model/wallet").members;
const MembershipType = require("app/model/wallet").membership_types;
const ReceivingAddress = require("app/model/wallet").receiving_addresses;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    search: async (req, res, next) => {
        try {
            const { query } = req;
            const limit = query.limit ? parseInt(req.query.limit) : 10;
            const offset = query.offset ? parseInt(req.query.offset) : 0;

            const memberCond = {};
            if (query.email) {
                memberCond.email = { [Op.iLike]: `%${query.email}%` };
            }
            if (query.membership_type_id) {
                memberCond.membership_type_id = query.membership_type_id;
            }

            const where = {};
            if (query.platform) {
                where.platform = query.platform;
            }
            if (query.address) {
                where.address = { [Op.iLike]: `%${query.address}%` };
            }

            const walletPrivateKeys = await WalletPrivateKey.findAndCountAll({
                  include: [
                    {
                      attributes: ['id', 'name', 'member_id', 'last_name', 'kyc_level', 'kyc_status', 'phone', 'city'],
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
                  order: [['name', 'DESC'],['platform','DESC']]
                }
              );

            return res.ok(true);
        }
        catch (error) {
            logger.info('search currency address fail', error);
            next(error);
        }
    }
};

