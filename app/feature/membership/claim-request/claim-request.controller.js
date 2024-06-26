/* eslint-disable no-cond-assign */
const logger = require('app/lib/logger');
const ClaimRequest = require("app/model/wallet").claim_requests;
const MemberRewardTransactionHis = require("app/model/wallet").member_reward_transaction_his;
const ClaimRequestStatus = require("app/model/wallet/value-object/claim-request-status");
const ClaimRequestStatusText = require("app/model/wallet/value-object/claim-request-status-text");
const MemberRewardTransactionAction = require("app/model/wallet/value-object/member-reward-transaction-action");
const { membershipApi } = require('app/lib/affiliate-api');
const database = require('app/lib/database').db().wallet;
const Member = require("app/model/wallet").members;
const moment = require('moment');
const mapper = require("app/feature/response-schema/claim-request.response-schema");
const Sequelize = require('sequelize');
const stringify = require('csv-stringify');
const Op = Sequelize.Op;
const PaymentType = require("app/model/wallet/value-object/claim-request-payment-type");
const Platform = require("app/model/wallet/value-object/platform");
const blockchainHelpper = require('app/lib/blockchain-helpper');
const SystemType = require("app/model/wallet/value-object/system-type");
const path = require('path');
const { readFileCSV } = require('app/lib/stream');
const { forEachSeries } = require('p-iteration');
const cryptoHelper = require('app/lib/crypto-helper');

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;
      const where = { system_type: SystemType.MEMBERSHIP };
      let fromDate, toDate;
      if (query.from_date || query.to_date) {
        where.created_at = {};
      }
      if (query.from_date) {
        fromDate = moment(query.from_date).toDate();
        where.created_at[Op.gte] = fromDate;
      }
      if (query.to_date) {
        toDate = moment(query.to_date).toDate();
        where.created_at[Op.lt] = toDate;
      }
      if (fromDate && toDate && fromDate >= toDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
      }
      if (query.payment) {
        where.type = query.payment;
      }
      if (query.status) {
        where.status = query.status;
      }
      if (query.crypto_platform) {
        where.currency_symbol = query.crypto_platform;
      }
      const memberCond = {
        deleted_flg: false
      };
      if (query.email) {
        memberCond.email = { [Op.iLike]: `%${query.email}%` };
      }
      if (query.first_name) {
        memberCond.first_name = { [Op.iLike]: `%${query.first_name}%` };
      }
      if (query.last_name) {
        memberCond.last_name = { [Op.iLike]: `%${query.last_name}%` };
      }

      let payoutFromDate, payoutToDate;
      if (query.payout_from_date || query.payout_to_date) {
        where.payout_transferred = {};
      }
      if (query.payout_from_date) {
        payoutFromDate = moment(query.payout_from_date).toDate();
        where.payout_transferred[Op.gte] = payoutFromDate;
      }
      if (query.payout_to_date) {
        payoutToDate = moment(query.payout_to_date).toDate();
        where.payout_transferred[Op.lt] = payoutToDate;
      }

      const { count: total, rows: items } = await ClaimRequest.findAndCountAll({
        limit,
        offset,
        include: [
          {
            attributes: ['id', 'email', 'fullname', 'first_name', 'last_name'],
            as: "Member",
            model: Member,
            where: memberCond,
            required: true
          }
        ],
        where: where,
        order: [['created_at', 'DESC']]
      });

      return res.ok({
        items: mapper(items) && items.length > 0 ? mapper(items) : [],
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (error) {
      logger.info('get claim request list fail', error);
      next(error);
    }
  },
  getDetail: async (req, res, next) => {
    try {
      const claimRequest = await ClaimRequest.findOne({
        include: [
          {
            attributes: ['email', 'fullname', 'first_name', 'last_name'],
            as: "Member",
            model: Member,
            where: {
              deleted_flg: false,
            },
            required: true
          }
        ],
        where: {
          id: req.params.claimRequestId,
          system_type: SystemType.MEMBERSHIP
        }
      });

      if (!claimRequest) {
        return res.badRequest(res.__("CLAIM_REQUEST_NOT_FOUND"), "CLAIM_REQUEST_NOT_FOUND", { field: ['claimRequestId'] });
      }
      claimRequest.explorer_link = blockchainHelpper.getUrlTxid(claimRequest.txid, claimRequest.currency_symbol);
      return res.ok(claimRequest);
    }
    catch (error) {
      logger.info('get claim request detail fail', error);
      next(error);
    }
  },
  updateTxid: async (req, res, next) => {
    let transaction;
    try {
      const { body, params } = req;
      const claimRequest = await ClaimRequest.findOne({
        where: {
          id: params.claimRequestId,
          system_type: SystemType.MEMBERSHIP
        }
      });
      if (!claimRequest) {
        return res.badRequest(res.__("CLAIM_REQUEST_NOT_FOUND"), "CLAIM_REQUEST_NOT_FOUND", { field: ['claimRequestId'] });
      }
      transaction = await database.transaction();
      await ClaimRequest.update(
        { txid: body.txid },
        {
          where: {
            id: claimRequest.id
          },
          transaction: transaction
        }
      );

      await MemberRewardTransactionHis.update(
        { tx_id: body.txid },
        {
          where: {
            claim_request_id: claimRequest.id
          },
          transaction: transaction
        }
      );
      await transaction.commit();
      return res.ok(true);
    }
    catch (error) {
      await transaction.rollback();
      logger.info('update claim request tx_id fail', error);
      next(error);
    }
  },
  updateTxidCSV: async (req, res, next) => {
    let transaction;
    try {
      const { body } = req;
      let file = path.parse(body.claimRequestTxid.file.name);
      if ((file.ext || '').toLowerCase() !== '.csv') {
        return res.badRequest(res.__("UNSUPPORTED_FILE_EXTENSION"), "UNSUPPORTED_FILE_EXTENSION", { fields: ["txid"] });
      }

      const records = await readFileCSV(body.claimRequestTxid.data);
      if (records.length == 0) {
        return res.badRequest(res.__("CSV_FILE_IS_EMPTY"), "CSV_FILE_IS_EMPTY", { field: [body.claimRequestTxid.file.name] });
      }
      const txidColumnName = 'TX ID';
      const timeTransferedColumn = 'Data Time transfered';
      const emptyItem = records.find(x => !x.Id || !x[txidColumnName]);
      if (emptyItem) {
        return res.badRequest(res.__("CSV_FILE_HAS_EMPTY_ID_OR_TXID"), "CSV_FILE_HAS_EMPTY_ID_OR_TXID", { field: [body.claimRequestTxid.file.name] });
      }
      const claimRequestIds = records.filter(x => x.Id).map(item => item.Id);
      // Check claim request
      const claimRequests = await ClaimRequest.findAll({
        where: {
          id: claimRequestIds,
          system_type: SystemType.MEMBERSHIP
        }
      });
      const cache = claimRequests.reduce((result, value) => {
        result[value.id] = value;

        return result;
      }, {});

      const notFoundIdList = [];
      claimRequestIds.forEach(id => {
        if (!cache[id]) {
          notFoundIdList.push(id);
        }
      });

      if (notFoundIdList.length > 0) {
        return res.badRequest(res.__("CLAIM_REQUEST_NOT_FOUND"), "CLAIM_REQUEST_NOT_FOUND", {
          field: ['Id'],
          notFoundIdList,
        });
      }

      const affiliateRewardIdList = [];
      transaction = await database.transaction();

      await forEachSeries(records, async (item) => {
        const claimRequest = cache[item.Id];
        let updateClaimRequestTask, memberRewardTransactionHisTask;

        if (!claimRequest) {
          return;
        }

        if (claimRequest.status === ClaimRequestStatus.Pending) {
          updateClaimRequestTask = ClaimRequest.update(
            {
              txid: item[txidColumnName],
              status: ClaimRequestStatus.Approved,
              payout_transferred: item[timeTransferedColumn] || Sequelize.fn('NOW')
            },
            {
              where: {
                id: item.Id
              },
              returning: true,
              transaction: transaction
            }
          );
          affiliateRewardIdList.push(claimRequest.affiliate_claim_reward_id);

          memberRewardTransactionHisTask = MemberRewardTransactionHis.create(
            {
              member_id: claimRequest.member_id,
              claim_request_id: claimRequest.id,
              currency_symbol: claimRequest.currency_symbol,
              amount: claimRequest.amount,
              action: MemberRewardTransactionAction.SENT,
              tx_id: item[txidColumnName],
              system_type: claimRequest.system_type,
              payout_transferred: item[timeTransferedColumn] || Sequelize.fn('NOW')
            }, {
            returning: true,
            transaction: transaction
          });

          await Promise.all([updateClaimRequestTask, memberRewardTransactionHisTask]);
          return;
        }
        const updateTransferredData = {
          txid: item[txidColumnName]
        };
        const updateTransferredHisData = {
          tx_id: item[txidColumnName]
        };
        if (item[timeTransferedColumn]) {
          updateTransferredData.payout_transferred = item[timeTransferedColumn];
          updateTransferredHisData.payout_transferred = item[timeTransferedColumn];
        }
        updateClaimRequestTask = ClaimRequest.update(
          updateTransferredData,
          {
            where: {
              id: item.Id
            },
            returning: true,
            transaction: transaction
          });

        memberRewardTransactionHisTask = MemberRewardTransactionHis.update(
          updateTransferredHisData,
          {
            where: {
              claim_request_id: item.Id
            },
            returning: true,
            transaction: transaction
          });

        await Promise.all([updateClaimRequestTask, memberRewardTransactionHisTask]);
      });

      if (affiliateRewardIdList.length > 0) {
        const result = await membershipApi.updateClaimRequests(affiliateRewardIdList, ClaimRequestStatus.Approved);

        if (result.httpCode !== 200) {
          await transaction.rollback();

          return res.status(result.httpCode).send(result.data);
        }
      }

      await transaction.commit();
      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      logger.info('update claim request tx_id fail', error);
      next(error);
    }
  },
  changeClaimRewardsStatus: async (req, res, next) => {
    try {
      const { body } = req;
      const claimRequests = await ClaimRequest.findAll({
        where: {
          id: body.claimRequestIds,
          system_type: SystemType.MEMBERSHIP
        }
      });

      const hasNotPendingRequest = claimRequests.some(item => item.status !== ClaimRequestStatus.Pending);
      if (hasNotPendingRequest) {
        return res.badRequest(res.__("CLAIM_REQUEST_LIST_HAVE_ONE_ID_CAN_NOT_APPROVE"), "CLAIM_REQUEST_LIST_HAVE_ONE_ID_CAN_NOT_APPROVE", { field: ['tokenPayoutIds'] });
      }

      const transaction = await database.transaction();
      try {
        await ClaimRequest.update(
          {
            status: ClaimRequestStatus.Approved,
            payout_transferred: Sequelize.fn('NOW')
          },
          {
            where: {
              id: body.claimRequestIds
            },
            transaction: transaction,
            returning: true
          });
        const dataRewardTracking = claimRequests.map(item => {
          return ({
            member_id: item.member_id,
            claim_request_id: item.id,
            currency_symbol: item.currency_symbol,
            amount: item.amount,
            action: MemberRewardTransactionAction.SENT,
            tx_id: item.txid,
            system_type: item.system_type,
            payout_transferred: Sequelize.fn('NOW')
          });
        });
        const idList = claimRequests.map(item => item.affiliate_claim_reward_id);
        await MemberRewardTransactionHis.bulkCreate(
          dataRewardTracking,
          {
            transaction: transaction,
            returning: true,
          });

        const result = await membershipApi.updateClaimRequests(idList, ClaimRequestStatus.Approved);

        if (result.httpCode !== 200) {
          await transaction.rollback();

          return res.status(result.httpCode).send(result.data);
        }

        await transaction.commit();
        return res.ok(true);
      }
      catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
    catch (error) {
      logger.info('update claim request fail', error);
      next(error);
    }
  },
  downloadCSV: async (req, res, next) => {
    try {
      const { query } = req;
      const where = { system_type: SystemType.MEMBERSHIP };
      let fromDate, toDate;
      if (query.from_date || query.to_date) {
        where.created_at = {};
      }
      if (query.from_date) {
        fromDate = moment(query.from_date).toDate();
        where.created_at[Op.gte] = fromDate;
      }
      if (query.to_date) {
        toDate = moment(query.to_date).toDate();
        where.created_at[Op.lt] = toDate;
      }
      if (fromDate && toDate && fromDate >= toDate) {
        return res.badRequest(res.__("TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE"), "TO_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_FROM_DATE", { field: ['from_date', 'to_date'] });
      }
      if (query.payment) {
        where.type = query.payment;
      }
      if (query.status) {
        where.status = query.status;
      }
      if (query.crypto_platform) {
        where.currency_symbol = query.crypto_platform;
      }
      let memberCond = {
        deleted_flg: false
      };
      if (query.email) {
        memberCond.email = { [Op.iLike]: `%${query.email}%` };
      }
      if (query.first_name) {
        memberCond.first_name = { [Op.iLike]: `%${query.first_name}%` };
      }
      if (query.last_name) {
        memberCond.last_name = { [Op.iLike]: `%${query.last_name}%` };
      }

      let payoutFromDate, payoutToDate;
      if (query.payout_from_date || query.payout_to_date) {
        where.payout_transferred = {};
      }
      if (query.payout_from_date) {
        payoutFromDate = moment(query.payout_from_date).toDate();
        where.payout_transferred[Op.gte] = payoutFromDate;
      }
      if (query.payout_to_date) {
        payoutToDate = moment(query.payout_to_date).toDate();
        where.payout_transferred[Op.lt] = payoutToDate;
      }

      const items = await ClaimRequest.findAll({
        include: [
          {
            attributes: ['email', 'fullname', 'first_name', 'last_name'],
            as: "Member",
            model: Member,
            where: memberCond,
            required: true
          }
        ],
        where: where,
        order: [['created_at', 'DESC']]
      });

      const timezone_offset = query.timezone_offset || 0;

      items.forEach(element => {
        element.member_email = element.Member.email;
        element.first_name = element.Member.first_name;
        element.last_name = element.Member.last_name;
        if (element.status === ClaimRequestStatus.Approved) {
          element.status = ClaimRequestStatusText.Approved;
        }
        if (element.status === ClaimRequestStatus.Pending) {
          element.status = ClaimRequestStatusText.Pending;
        }
        element.created_at = moment(element.createdAt).add(- timezone_offset, 'minutes').format('YYYY-MM-DD HH:mm');
      });
      const data = await stringifyAsync(items, [
        { key: 'id', header: 'Id' },
        { key: 'created_at', header: 'Time' },
        { key: 'first_name', header: 'First Name' },
        { key: 'last_name', header: 'Last Name' },
        { key: 'member_email', header: 'Email' },
        { key: 'wallet_address', header: 'Wallet Address' },
        { key: 'amount', header: 'Claim Amount' },
        { key: 'network_fee', header: 'Network fee' },
        { key: 'currency_symbol', header: 'Currency' },
        { key: 'status', header: 'Status' },
        { key: 'type', header: 'Payment' },
        { key: 'original_amount', header: 'Original amount' },
        { key: 'network_fee', header: 'Network fee' }
      ]);
      res.setHeader('Content-disposition', 'attachment; filename=claim-request.csv');
      res.set('Content-Type', 'text/csv');
      res.send(cryptoHelper.encrypt(data));
    }
    catch (error) {
      logger.info('download csv fail', error);
      next(error);
    }
  },
  getPaymentType: async (req, res, next) => {
    try {
      return res.ok(PaymentType);
    }
    catch (error) {
      logger.info('get payment type fail', error);
      next(error);
    }
  },
  getCryptoPlatform: async (req, res, next) => {
    try {
      return res.ok(Platform);
    }
    catch (error) {
      logger.info('get crypto platform fail', error);
      next(error);
    }
  },
  updatePayoutTransferred: async (req, res, next) => {
    let transaction;
    try {
      const { params, body } = req;
      const payout_transferred = moment(body.payoutTransferred).toDate();
      const claimRequest = await ClaimRequest.findOne({
        where: {
          id: params.claimRequestId,
          system_type: SystemType.MEMBERSHIP
        }
      });

      if (!claimRequest) {
        return res.badRequest(res.__("CLAIM_REQUEST_NOT_FOUND"), "CLAIM_REQUEST_NOT_FOUND", { field: ['claimRequestId'] });
      }

      if (claimRequest.status !== ClaimRequestStatus.Approved) {
        return res.forbidden(res.__("CLAIM_REQUEST_NOT_APPROVED"), "CLAIM_REQUEST_NOT_APPROVED", { field: ['claimRequestId'] });
      }
      transaction = await database.transaction();
      await ClaimRequest.update({
        payout_transferred: payout_transferred
      }, {
        where: {
          id: params.claimRequestId
        },
        returning: true,
        transaction: transaction
      });

      await MemberRewardTransactionHis.update({
        payout_transferred: payout_transferred
      }, {
        where: {
          claim_request_id: params.claimRequestId
        },
        returning: true,
        transaction: transaction
      });
      await transaction.commit();
      return res.ok(true);
    }
    catch (error) {
      if (transaction) {
        transaction.rollback();
      }
      logger.error('Update payout transferred fail', error);
      next(error);
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
