const moment = require('moment');
const { map } = require('p-iteration');
const addressParser = require('address-rfc2822');
const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const database = require('app/lib/database').db().wallet;
const MembershipOrder = require("app/model/wallet").membership_orders;
const Wallet = require("app/model/wallet").wallets;
const ReceivingAddress = require("app/model/wallet").receiving_addresses;
const MembershipType = require("app/model/wallet").membership_types;
const MemberRewardTransactionHistory = require("app/model/wallet").member_reward_transaction_his;
const MemberRewardCommissionMethod = require("app/model/wallet/value-object/member-reward-transaction-commission-method");
const MemberRewardAction = require("app/model/wallet/value-object/member-reward-transaction-action");
const SystemType = require('app/model/wallet/value-object/system-type');
const MembershipOrderStatus = require("app/model/wallet/value-object/membership-order-status");
const membershipOrderMapper = require("app/feature/response-schema/membership-order.response-schema");
const Sequelize = require('sequelize');
const stringify = require('csv-stringify');
const { membershipApi } = require('app/lib/affiliate-api');
const blockchainHelpper = require('app/lib/blockchain-helpper');
const config = require('app/config');
const mailer = require('app/lib/mailer');
const maskify = require('app/lib/maskify');
const PaymentType = require('app/model/wallet/value-object/claim-request-payment-type')

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

      if (query.order_no) {
        where.order_no = { [Op.iLike]: `%${query.order_no}%` };
      }
      if (query.payment_status) {
        where.status = query.payment_status;
      }
      if (query.bank_account_number) {
        where.account_number = { [Op.iLike]: `%${query.bank_account_number}%` };
      }
      if (query.crypto_receive_address) {
        where.wallet_address = { [Op.iLike]: `%${query.crypto_receive_address}%` };
      }
      if (query.email) {
        memberWhere.email = { [Op.iLike]: `%${query.email}%` };
      }
      if (query.memo) {
        where.memo = { [Op.iLike]: `%${query.memo}%` };
      }
      if (query.first_name) {
        memberWhere.first_name = {[Op.iLike]: `%${query.first_name}%` }
      }
      if (query.last_name) {
        memberWhere.last_name = {[Op.iLike]: `%${query.last_name}%` }
      }
      if(query.is_bank){
        where.payment_type = PaymentType.Bank
      }
      else{
        if(query.is_crypto && query.currency_symbol){
          where.currency_symbol = query.currency_symbol
          if(query.is_external)
            where.wallet_id =  {[Op.eq]: null}
          else
            where.wallet_id =  {[Op.ne]: null}        
        }
      }

      let fromDate, toDate;
      if (query.from && query.to) {
        where.created_at = {};
        let fromDate = moment(query.from).add(1, 'minute').toDate();
        let toDate = moment(query.to).add(1, 'minute').toDate();
        where.created_at[Op.gte] = fromDate; 
        where.created_at[Op.lt] = toDate;
      }

      if (fromDate && toDate && fromDate >= toDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
      }

      if (query.membership_type_id) {
        where.membership_type_id = query.membership_type_id;
      }

      const { count: total, rows: items } = await MembershipOrder.findAndCountAll(
        {
          limit,
          offset,
          include: [
            {
              attributes: ['email', 'fullname', 'first_name', 'last_name', 'kyc_level', 'kyc_status', 'phone', 'city'],
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
        item.explorer_link = blockchainHelpper.getUrlTxid(item.txid, item.currency_symbol);
      });

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
      const memberWhere = {
        deleted_flg: false
      };

      const membershipOrder = await MembershipOrder.findOne(
        {
          include: [
            {
              attributes: ['email', 'fullname', 'first_name', 'last_name', 'kyc_level', 'kyc_status', 'phone', 'city'],
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
            },
            {
              attributes: ['id', 'name'],
              as: "Wallet",
              model: Wallet
            },
            {
              attributes: ['id', 'currency_symbol', 'wallet_address'],
              as: "ReceivingAddress",
              model: ReceivingAddress
            },
          ],
          where: {
            id: params.id
          }
        });
      if (!membershipOrder) {
        return res.badRequest(res.__("MEMBERSHIPORDER_NOT_FOUND"), "MEMBERSHIPORDER_NOT_FOUND", { fields: ["id"] });
      }

      membershipOrder.explorer_link = blockchainHelpper.getUrlTxid(membershipOrder.txid, membershipOrder.currency_symbol);
      console.log(membershipOrder);
      return res.ok(membershipOrderMapper(membershipOrder));
    }
    catch (error) {
      logger.error('get membership order detail fail:', error);
      next(error);
    }
  },
  approveOrder: async (req, res, next) => {
    let transaction;

    try {
      let order = await MembershipOrder.findOne({
        where: { id: req.params.id },
        include: {
          attributes: ['email'],
          as: "Member",
          model: Member,
          required: true
        }
      });

      if (!order) {
        return res.notFound(res.__("MEMBERSHIP_ORDER_NOT_FOUND"), "MEMBERSHIP_ORDER_NOT_FOUND");
      }

      if (order.status !== MembershipOrderStatus.Pending) {
        return res.forbidden(res.__("CAN_NOT_UPDATE_MEMBERSHIP_ORDER_STATUS"), "CAN_NOT_UPDATE_MEMBERSHIP_ORDER_STATUS");
      }

      transaction = await database.transaction();
      let status = req.body.action == 1 ? MembershipOrderStatus.Approved : MembershipOrderStatus.Rejected;
      await MembershipOrder.update({
        notes: req.body.note,
        approved_by_id: req.user.id,
        status: status
      }, {
        where: {
          id: req.params.id
        },
        returning: true,
        transaction: transaction
      });

      if (status == MembershipOrderStatus.Approved) {
        await Member.update({
          membership_type_id: order.membership_type_id
        }, {
          where: {
            id: order.member_id
          },
          returning: true,
          transaction: transaction
        });

        const membershipType = await MembershipType.findOne({
          where: {
            id: order.membership_type_id
          }
        });

        if (!membershipType) {
          return res.notFound(res.__("MEMBERSHIP_TYPE_NOT_FOUND"), "MEMBERSHIP_TYPE_NOT_FOUND", { fields: ["memberTypeId"] });
        }

        const result = await membershipApi.registerMembership({
          email: order.Member.email,
          referrerCode: order.referrer_code,
          membershipOrderId: order.id.toString(),
          membershipType,
        });

        if (result.httpCode != 200) {
          await transaction.rollback();

          return res.status(result.httpCode).send(result.data);
        }

        // Save reward transaction histories
        const memberRewardTransactionHistories = await map(result.data.rewards || [], async (item) => {
          const member = await _findMemberByEmail(item.ext_client_id);
          if (!member) {
            return;
          }

          const introducedByEmail = item.introduced_by_ext_client_id;

          return {
            member_id: member.id,
            currency_symbol: item.currency_symbol,
            amount: item.amount,
            commission_method: item.commisson_type.toUpperCase() === 'DIRECT' ? MemberRewardCommissionMethod.DIRECT : MemberRewardCommissionMethod.INDIRECT,
            system_type: SystemType.MEMBERSHIP,
            action: MemberRewardAction.REWARD_COMMISSION,
            commission_from: null,
            note: introducedByEmail,
          };
        });
        await MemberRewardTransactionHistory.bulkCreate(memberRewardTransactionHistories, { transaction });

        await MembershipOrder.update({
          referral_code: result.data.affiliate_code.code
        }, {
          where: {
            id: order.id
          },
          returning: true,
          transaction: transaction
        });
        // reject all pending orders
        await MembershipOrder.update({
          status: MembershipOrderStatus.Rejected,
          approved_by_id: req.user.id,
          notes: 'The other is approved'
        }, {
          where: {
            status: MembershipOrderStatus.Pending,
            [Op.not]: [
              { id: [order.id] }
            ]
          },
          returning: true,
          transaction: transaction
        });
        await _sendEmail(order.Member.email, order.id, true);
      } else {
        await _sendEmail(order.Member.email, order.id, false);
      }
      await transaction.commit();

      return res.ok(true);
    }
    catch (err) {
      if (transaction) {
        await transaction.rollback();
      }

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

      if (query.order_no) {
        where.order_no = { [Op.iLike]: `%${query.order_no}%` };
      }
      if (query.payment_status) {
        where.status = query.payment_status;
      }
      if (query.bank_account_number) {
        where.account_number = { [Op.iLike]: `%${query.bank_account_number}%` };
      }
      if (query.crypto_receive_address) {
        where.wallet_address = { [Op.iLike]: `%${query.crypto_receive_address}%` };
      }
      if (query.email) {
        memberWhere.email = { [Op.iLike]: `%${query.email}%` };
      }

      if (query.memo) {
        where.memo = { [Op.iLike]: `%${query.memo}%` };
      }

      if (query.first_name) {
        memberWhere.first_name = {[Op.iLike]: `%${query.first_name}%` }
      }
      if (query.last_name) {
        memberWhere.last_name = {[Op.iLike]: `%${query.last_name}%` }
      }

      if(query.is_bank){
        where.payment_type = PaymentType.Bank
      }
      else{
        if(query.is_crypto && query.currency_symbol){
          where.currency_symbol = query.currency_symbol
          if(query.is_external)
            where.wallet_id =  {[Op.eq]: null}
          else
            where.wallet_id =  {[Op.ne]: null}        
        }
      }

      let fromDate, toDate;
      if (query.from && query.to) {
        where.created_at = {};
        let fromDate = moment(query.from).add(1, 'minute').toDate();
        let toDate = moment(query.to).add(1, 'minute').toDate();
        where.created_at[Op.gte] = fromDate; 
        where.created_at[Op.lt] = toDate;
      }

      if (fromDate && toDate && fromDate >= toDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
      }

      if (query.membership_type_id) {
        where.membership_type_id = query.membership_type_id;
      }

      const items = await MembershipOrder.findAll(
        {
          include: [
            {
              attributes: ['email', 'fullname', 'first_name', 'last_name', 'kyc_level', 'kyc_status', 'phone', 'city'],
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
      let timezone_offset = query.timezone_offset || 0;
      items.forEach(element => {
        element.email = element.Member.email;
        element.first_name = element.Member.first_name;
        element.last_name = element.Member.last_name;
        element.membership_type_name = element.MembershipType.name;
        element.time = moment(element.createdAt).add(- timezone_offset, 'minutes').format('YYYY-MM-DD HH:mm');
      });
      let data = await stringifyAsync(items, [
        { key: 'order_no', header: 'Order No' },
        { key: 'time', header: 'Time' },
        { key: 'first_name', header: 'First Name' },
        { key: 'last_name', header: 'Last Name' },
        { key: 'email', header: 'Email' },
        { key: 'membership_type_name', header: 'Membership' },
        { key: 'payment_type', header: 'Payment Type' },
        { key: 'account_number', header: 'Bank Acc No' },
        { key: 'wallet_address', header: 'Receive address' },
        { key: 'status', header: 'Status' },
        { key: 'wallet_id', header: 'Walllet Id' },
      ]);
      res.setHeader('Content-disposition', 'attachment; filename=orders.csv');
      res.set('Content-Type', 'text/csv');
      res.send(data);
    }
    catch (err) {
      logger.error('search order fail:', err);
      next(err);
    }
  },
};

function stringifyAsync(data, columns) {
  return new Promise(function (resolve, reject) {
    stringify(data, {
      header: true,
      columns: columns
    }, function (err, data) {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    }
    );
  });
}

async function _sendEmail(emails, id, approved) {
  try {
    let subject = `Membership payment`;
    let from = `Child membership department`;
    let data = {
      id: id
    };
    data = Object.assign({}, data, config.email);
    if (approved)
      await mailer.sendWithTemplate(subject, from, emails, data, config.emailTemplate.membershipOrderApproved);
    else
      await mailer.sendWithTemplate(subject, from, emails, data, config.emailTemplate.membershipOrderRejected);
  } catch (err) {
    logger.error("send confirmed membership order email", err);
  }
}

async function _findMemberByEmail(email) {
  let member = await Member.findOne({
    where: {
      email: email.toLowerCase(),
      deleted_flg: false,
    },
  });

  // Try to get member which was deleted
  if (!member) {
    member = await Member.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  return member;
}

function _maskEmailAddress(email) {
  if (!email) {
    return email;
  }

  const addresses = addressParser.parse(email);
  const address = addresses[0];
  let name = address.user();
  let host = address.host();
  name = maskify(name, {
    maskSymbol: "*",
    matchPattern: /^.+$/,
    visibleCharsStart: 2,
    visibleCharsEnd: 2,
    minChars: 2,
  });

  host = maskify(host, {
    maskSymbol: "*",
    matchPattern: /\w+$/,
    visibleCharsStart: 2,
    visibleCharsEnd: 0,
    minChars: 2,
  });

  return name + '@' + host;
}