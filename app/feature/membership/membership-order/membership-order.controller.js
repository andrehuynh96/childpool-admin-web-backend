const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const database = require('app/lib/database').db().wallet;
const MembershipOrder = require("app/model/wallet").membership_orders;
const MembershipType = require("app/model/wallet").membership_types;
const MembershipOrderStatus = require("app/model/wallet/value-object/membership-order-status")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment')
const membershipOrderMapper = require("app/feature/response-schema/membership-order.response-schema");
const stringify = require('csv-stringify')

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
      if (query.email) memberWhere.email = query.email
      if (query.from) {
        let fromDate = moment(query.from).add(1, 'minute').toDate();
        where.created_at = {
          [Op.gte]: fromDate
        };
      }
      if (query.to) {
        let toDate = moment(query.to).add(1, 'minute').toDate();
        where.created_at = {
          [Op.lte]: toDate
        };
      }
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

      items.forEach(item => {
        item.explorer_link = getUrlTxid(item.txid, item.currency_symbol)
      })

      return res.ok({
        items: membershipOrderMapper(items) && items.length > 0 ? membershipOrderMapper(items) : [],
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
          where: {
            id: params.id
          }
        });
      if (!membershipOrder) {
        return res.badRequest(res.__("MEMBERSHIPORDER_NOT_FOUND"), "MEMBERSHIPORDER_NOT_FOUND", { fields: ["id"] });
      }
      membershipOrder.explorer_link = getUrlTxid(membershipOrder.txid, membershipOrder.currency_symbol)
      return res.ok(membershipOrderMapper(membershipOrder));
    }
    catch (error) {
      logger.error('get membership order detail fail:', error);
      next(error);
    }
  },
  approveOrder: async (req, res, next) => {
    const t = await database.transaction();

    try {
      let order = MembershipOrder.findOne({ where: { id: req.params.id } })
      if (!order)
        return res.ok(false)

      let status = req.body.action == 1 ? MembershipOrderStatus.Completed : MembershipOrderStatus.Rejected
      await MembershipOrder.update({
        notes: req.body.note,
        approved_by_id: req.user.id,
        status: status
      }, {
        where: {
          id: req.params.id
        },
        returning: true,
        transaction: t
      });

      if (status == MembershipOrderStatus.Completed) {
        await Member.update({
          membership_type_id: order.membership_type_id
        }, {
          where: {
            id: order.member_id
          },
          returning: true,
          transaction: t
        });
      }
      await t.commit();
      return res.ok(true)
    }
    catch (err) {
      await t.rollback();
      logger.error('update order fail:', err);
      next(err);
    }
  },

  downloadCSV: async (req, res, next) => {
    try {
      const { query } = req;
      const where = {
      };
      const memberWhere = {
        deleted_flg: false
      };

      if (query.order_id) where.id = query.order_id;
      if (query.payment_status) where.status = query.payment_status;
      if (query.bank_account_number) where.account_number = query.bank_account_number
      if (query.crypto_receive_address) where.wallet_address = query.crypto_receive_address
      if (query.email) memberWhere.email = query.email
      if (query.from) {
        let fromDate = moment(query.from).toDate();
        where.created_at = {
          [Op.gte]: fromDate
        };
      }
      if (query.to) {
        let toDate = moment(query.to).toDate();
        where.created_at = {
          [Op.lte]: toDate
        };
      }
      if (query.membership_type_id) where.membership_type_id = query.membership_type_id

      const { count: total, rows: items } = await MembershipOrder.findAndCountAll(
        {
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
      items.forEach(element => {
        element.email = element.Member.email
        element.membership_type_name = element.MembershipType.name      
      });

      let data = await stringifyAsync(items, [
        { key: 'createdAt', header: 'Time' },
        { key: 'id', header: 'Order No' },
        { key: 'email', header: 'Email' },
        { key: 'membership_type_name', header: 'Membership' },
        { key: 'payment_type', header: 'Payment Type' },
        { key: 'account_number', header: 'Bank Acc No' },
        { key: 'wallet_address', header: 'Receive address' },
        { key: 'status', header: 'Status' }
      ])
      res.setHeader('Content-disposition', 'attachment; filename=orders.csv');
      res.set('Content-Type', 'text/csv');
      res.send(data);
    }
    catch (err) {
      logger.error('search order fail:', err);
      next(err);
    }
  },
}

function getUrlTxid(txid, currencySymbol){
    if(!txid || txid.length < 2)
      return txid
    let origin = txid[0] == '0' && txid[1] == 'x' ? txid.replace(/0x/g,'') : txid
    switch(currencySymbol){
      case 'BTC':
        return `https://www.blockchain.com/btc/tx/${origin}`
      case 'BCH':
        return `https://www.blockchain.com/bch/tx/${origin}`
      case 'ETH':
        return `https://www.blockchain.com/eth/tx/0x${origin}`
      case 'USDT':
        return `https://etherscan.io/token/0x${origin}`
      default:
        return txid
    }
}

function stringifyAsync(data, columns) {
  return new Promise(function (resolve, reject) {
    stringify(data, {
      header: true,
      columns: columns
    }, function (err, data) {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    }
    )
  })
}

// async function _sendEmail(emails, membershipType) {
//     try {
//       let subject = `Membership payment`;
//       let from = `Child membership department`;
//       let data = {
//       }
//       data = Object.assign({}, data, config.email);
//       await mailer.sendWithTemplate(subject, from, emails, data, config.emailTemplate.viewRequest);
//     } catch (err) {
//       logger.error("send confirmed email for changing reward address for master pool fail", err);
//     }
// }
