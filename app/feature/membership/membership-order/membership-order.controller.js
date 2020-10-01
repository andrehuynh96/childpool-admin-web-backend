const moment = require('moment');
const { map } = require('p-iteration');
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
const PaymentType = require('app/model/wallet/value-object/claim-request-payment-type');
const EmailTemplate = require('app/model/wallet').email_templates;
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type');
const stringHelper = require('app/lib/string-helper');

const Op = Sequelize.Op;
const MembershipOrderStatusEnum = {
  Pending: 'Verify payment',
  Rejected: 'Rejected',
  Approved: 'Approved',
};

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
        memberWhere.first_name = { [Op.iLike]: `%${query.first_name}%` };
      }
      if (query.last_name) {
        memberWhere.last_name = { [Op.iLike]: `%${query.last_name}%` };
      }
      if (query.is_bank) {
        where.payment_type = PaymentType.Bank;
      }
      else {
        if (query.is_crypto && query.currency_symbol) {
          if (query.currency_symbol == 'BTC') {
            where.currency_symbol = { [Op.in]: ['BTC','BTCSW'] };
          }
          else {
            where.currency_symbol = query.currency_symbol;
          }
          if (query.is_external)
            where.wallet_id = { [Op.eq]: null };
          else
            where.wallet_id = { [Op.ne]: null };
        }
      }
      let fromDate, toDate;
      if (query.from && query.to) {
        where.created_at = {};
        let fromDate = moment(query.from).toDate();
        let toDate = moment(query.to).toDate();
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
        return res.badRequest(res.__("MEMBERSHIP_ORDER_NOT_FOUND"), "MEMBERSHIP_ORDER_NOT_FOUND", { fields: ["id"] });
      }

      membershipOrder.explorer_link = blockchainHelpper.getUrlTxid(membershipOrder.txid, membershipOrder.currency_symbol);
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
      const order = await MembershipOrder.findOne({
        where: { id: req.params.id },
        include: {
          attributes: ['email', 'first_name', 'last_name', 'current_language'],
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

      const membershipType = await MembershipType.findOne({
        where: {
          id: order.membership_type_id
        }
      });

      if (!membershipType) {
        return res.notFound(res.__("MEMBERSHIP_TYPE_NOT_FOUND"), "MEMBERSHIP_TYPE_NOT_FOUND", { fields: ["memberTypeId"] });
      }

      transaction = await database.transaction();
      await MembershipOrder.update({
        notes: req.body.note,
        approved_by_id: req.user.id,
        status: MembershipOrderStatus.Approved,
        approved_at: Sequelize.fn('NOW'),
      }, {
        where: {
          id: req.params.id
        },
        returning: true,
        transaction: transaction
      });

      const emailPayload = {
        id: order.id,
        note: req.body.note,
        imageUrl: config.website.urlImages,
        firstName: order.Member.first_name,
        lastName: order.Member.last_name,
        language: order.Member.current_language || 'en',
      };

      await Member.update({
        membership_type_id: order.membership_type_id,
        latest_membership_order_id: order.id,
      }, {
        where: {
          id: order.member_id
        },
        returning: true,
        transaction: transaction
      });

      const result = await membershipApi.registerMembership({
        email: order.Member.email,
        referrerCode: order.referrer_code,
        membershipOrder: order,
        membershipType,
      });

      if (result.httpCode != 200) {
        await transaction.rollback();

        return res.status(result.httpCode).send(result.data);
      }

      // Save reward transaction histories
      let memberRewardTransactionHistories = await map(result.data.rewards || [], async (item) => {
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
          membership_order_id: order.id,
        };
      });
      memberRewardTransactionHistories = memberRewardTransactionHistories.filter(item => item && item.member_id);
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
        description: 'The other is approved',
        approved_at: Sequelize.fn('NOW'),
        updated_description_at: Sequelize.fn('NOW'),
      }, {
        where: {
          status: MembershipOrderStatus.Pending,
          member_id: order.member_id,
          [Op.not]: [
            { id: [order.id] }
          ]
        },
        returning: true,
        transaction: transaction
      });

      await _sendEmail(order.Member.email, emailPayload, EmailTemplateType.MEMBERSHIP_ORDER_APPROVED);
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
  rejectOrder: async (req, res, next) => {
    let transaction;

    try {
      const { body } = req;
      const { note, template } = body;
      if ((!template && !note) || (template && note)) {
        return res.badRequest(res.__('MISSING_PARAMETERS'), 'MISSING_PARAMETERS');
      }

      const order = await MembershipOrder.findOne({
        where: { id: req.params.id },
        include: {
          attributes: ['email', 'first_name', 'last_name', 'current_language'],
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

      const emailPayload = {
        id: order.id,
        imageUrl: config.website.urlImages,
        firstName: order.Member.first_name,
        lastName: order.Member.last_name,
        language: order.Member.current_language || 'en',
        note: stringHelper.createMarkupWithNewLine(note),
      };

      if (template && !note) {
        const emailTemplate = await _findEmailTemplate(template, emailPayload.language);

        if (!emailTemplate) {
          return res.notFound(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { data: { template } });
        }

        emailPayload.emailTemplate = emailTemplate;
      }

      transaction = await database.transaction();
      const updateMemberTask = Member.update({
        latest_membership_order_id: order.id,
      }, {
        where: {
          id: order.member_id
        },
        returning: true,
        transaction: transaction
      });
      const updateMembershipOrderTask = MembershipOrder.update({
        notes: note,
        status: MembershipOrderStatus.Rejected,
        approved_at: Sequelize.fn('NOW'),
      }, {
        where: {
          id: order.id
        },
        returning: true,
        transaction: transaction,
      });

      await Promise.all([updateMemberTask, updateMembershipOrderTask]);
      await _sendEmail(order.Member.email, emailPayload, EmailTemplateType.MEMBERSHIP_ORDER_REJECTED);
      await transaction.commit();

      return res.ok(true);
    }
    catch (error) {
      logger.error('rejectOrder fail:', error);
      if (transaction) {
        await transaction.rollback();
      }

      next(error);
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
        memberWhere.first_name = { [Op.iLike]: `%${query.first_name}%` };
      }
      if (query.last_name) {
        memberWhere.last_name = { [Op.iLike]: `%${query.last_name}%` };
      }

      if (query.is_bank) {
        where.payment_type = PaymentType.Bank;
      }
      else {
        if (query.is_crypto && query.currency_symbol) {
          if (query.currency_symbol == 'BTC') {
            where.currency_symbol = { [Op.in]: ['BTC','BTCSW'] };
          }
          else {
            where.currency_symbol = query.currency_symbol;
          }
          if (query.is_external)
            where.wallet_id = { [Op.eq]: null };
          else
            where.wallet_id = { [Op.ne]: null };
        }
      }

      let fromDate, toDate;
      if (query.from && query.to) {
        where.created_at = {};
        let fromDate = moment(query.from).toDate();
        let toDate = moment(query.to).toDate();
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
            },
            {
              attributes: ['id', 'currency_symbol', 'wallet_address'],
              as: "ReceivingAddress",
              model: ReceivingAddress
            },
          ],
          where: where,
          order: [['created_at', 'DESC']]
        }
      );
      let timezone_offset = query.time_offset || 0;
      items.forEach(element => {
        element.email = element.Member.email;
        element.first_name = element.Member.first_name;
        element.last_name = element.Member.last_name;
        element.time_requested = moment(element.createdAt).add(- timezone_offset, 'minutes').format('YYYY-MM-DD HH:mm');
        element.receiving_addresses = element.ReceivingAddress ? element.ReceivingAddress['wallet_address'] : '';
        element.membership_type = element.MembershipType ? element.MembershipType['name'] : '';
        element.status_string = MembershipOrderStatusEnum[element.status];
      });
      let data = await stringifyAsync(items, [
        { key: 'id', header: 'Order' },
        { key: 'time_requested', header: 'Date Time' },
        { key: 'first_name', header: 'First Name' },
        { key: 'last_name', header: 'Last Name' },
        { key: 'email', header: 'Email' },
        { key: 'membership_type', header: 'Membership' },
        { key: 'payment_type', header: 'Payment' },
        { key: 'receiving_addresses', header: 'Receiving Address' },
        { key: 'status_string', header: 'Status' },
      ]);
      res.setHeader('Content-disposition', 'attachment; filename=orders.csv');
      res.set('Content-Type', 'text/csv');
      res.send(data);
    }
    catch (err) {
      logger.error('csv order fail:', err);
      next(err);
    }
  },
  updateDescription: async (req, res, next) => {
    try {
      let id = req.params.id;
      let des = req.body.description;
      if (!id) {
        return res.ok(false);
      }

      await MembershipOrder.update({
        description: des,
        updated_description_at: Sequelize.fn('NOW'),
      }, {
        where: {
          id: id
        },
        returning: true
      });

      return res.ok(true);
    }
    catch (err) {
      logger.error('update order description fail:', err);
      next(err);
    }
  }
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

async function _sendEmail(email, payload, templateName) {
  let subject, body;

  if (payload.emailTemplate) {
    subject = payload.emailTemplate.subject;
    body = payload.emailTemplate.template;

    delete payload.emailTemplate;
  } else {
    const emailTemplate = await _findEmailTemplate(templateName, payload.language);
    if (!emailTemplate) {
      logger.error(`Can not find email template: ${templateName}.`);
      return;
    }

    subject = emailTemplate.subject;
    body = emailTemplate.template;
  }

  const from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
  const data = Object.assign({}, payload, config.email);

  await mailer.sendWithDBTemplate(subject, from, email, data, body);
}

async function _findMemberByEmail(email) {
  let member = await Member.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  return member;
}

async function _findEmailTemplate(templateName, language) {
  let template = await EmailTemplate.findOne({
    where: {
      name: templateName,
      language: language
    }
  });

  if (!template && language !== 'en') {
    template = await EmailTemplate.findOne({
      where: {
        name: templateName,
        language: 'en'
      }
    });
  }

  return template;
}
