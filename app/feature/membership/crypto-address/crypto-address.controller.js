const _ = require('lodash');
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
            where.address = {};
            if (query.address) {
                where.address[Op.iLike] = `%${query.address}%` ;
            }

            if (memberCond.email || memberCond.membership_type_id) {
              const members = await Member.findAll({
                where: memberCond
              });
              const memberIds = members.map(item => item.id);
              const wallets = await Wallet.findAll({
                where: {
                  member_id: memberIds
                }
              });
              where.wallet_id = wallets.map(item => item.id);
            }

            const receivingAddresses = await ReceivingAddress.findAll({
              attributes: ['wallet_address'],
              raw: true
            });

            const receivingAddressList = receivingAddresses.map(item => item.wallet_address);
            if (query.reward) {
              where.address[Op.in] = receivingAddressList;
            }
            else {
              where.address[Op.not] = receivingAddressList;
            }

            const walletPrivKeys = await WalletPrivateKey.findAll({
              attributes: ['wallet_id','address','platform'],
              where: where,
              raw: true
            });

            const lastCond = {};
            lastCond.address = walletPrivKeys.map(item => item.address);

            const { count: total, rows: items } = await WalletPrivateKey.findAndCountAll({
              limit,
              offset,
              where: where,
              raw: true,
              order: [['address', 'DESC']]
            });

            const walletIds = items.map(item => item.wallet_id);
            const wallets = await Wallet.findAll({
              where: {
                id: walletIds
              },
              raw: true
            });

            items.forEach(item => {
              const wallet = wallets.find(x => x.id === item.wallet_id);
              if (wallet) {
                item.wallet_name = wallet.name;
                item.member_id = wallet.member_id;
              }
            });


            const memberIds = wallets.map(item => item.member_id);
            const members = await Member.findAll({
              where: {
                id: memberIds
              },
              raw: true
            });
            items.forEach(item => {
              const member = members.find(x => x.id === item.member_id);
              if (member) {
                item.first_name = member.first_name;
                item.last_name = member.last_name;
                item.email = member.email;
                item.membership_type_id = member.membership_type_id;
                item.kyc_level = member.kyc_level.replace('LEVEL_','');
              }
            });

            const membershipTypes = await MembershipType.findAll();

            items.forEach(item => {
              const membershipType = membershipTypes.find(x => x.id === item.membership_type_id);
              if (membershipType) {
                item.membership_type = membershipType.name;
              }
              else {
                item.membership_type = 'Basic';
              }
            });

            return res.ok({
              items: items.length > 0 ? items : [],
              offset: offset,
              limit: limit,
              total: total
            });
        }
        catch (error) {
            logger.info('search currency address fail', error);
            next(error);
        }
    }
};

