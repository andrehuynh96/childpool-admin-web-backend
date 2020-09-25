const logger = require('app/lib/logger');
const MemberAssets = require('app/model/wallet').member_assets;
const Member = require('app/model/wallet').members;
const Wallet = require('app/model/wallet').wallets;
const WalletPrivKey = require('app/model/wallet').wallet_priv_keys;
const moment = require('moment');
const Sequelize = require('sequelize');
const stringify = require('csv-stringify');
const Op = Sequelize.Op;
const Currencies = require("app/model/wallet").currencies;
const config = require("../../../app/config");
const BigNumber = require('bignumber.js');

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
        toDate = moment(query.to_date).toDate();
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

      if (query.platform) {
        if (query.balanceFrom || query.balanceTo) {
          where.balance = {};
        }
        if (query.amountFrom || query.amountTo) {
          where.amount = {};
        }
        const currency = await Currencies.findOne({
          where: {
            platform: query.platform
          }
        });
        if (currency) {
          if (query.balanceFrom) {
            where.balance[Op.gte] = BigNumber(query.balanceFrom).multipliedBy(10 ** currency.decimals);
          }
          if (query.balanceTo) {
            where.balance[Op.lte] = BigNumber(query.balanceTo).multipliedBy(10 ** currency.decimals);
          }
          if (query.amountFrom) {
            where.amount[Op.gte] = BigNumber(query.amountFrom).multipliedBy(10 ** currency.decimals);
          }
          if (query.amountTo) {
            where.amount[Op.lte] = BigNumber(query.amountTo).multipliedBy(10 ** currency.decimals);
          }
        }
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
  },
  downloadCSV: async (req, res, next) => {
    try {
      const { query } = req;
      const timezone_offset = query.timezone_offset || 0;
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
        toDate = moment(query.to_date).toDate();
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

        const addressList = walletPrivKeys.map(item => item.address);
        where.address[Op.in] = addressList;
      }

      if (query.address) {
        where.address[Op.iLike] = `%${query.address}%`;
      }

      if (query.platform) {
        where.platform = query.platform;
      }

      if (query.platform) {
        if (query.balanceFrom || query.balanceTo) {
          where.balance = {};
        }
        if (query.amountFrom || query.amountTo) {
          where.amount = {};
        }
        const currency = await Currencies.findOne({
          where: {
            platform: query.platform
          }
        });
        if (currency) {
          if (query.balanceFrom) {
            where.balance[Op.gte] = BigNumber(query.balanceFrom).multipliedBy(10 ** currency.decimals);
          }
          if (query.balanceTo) {
            where.balance[Op.lte] = BigNumber(query.balanceTo).multipliedBy(10 ** currency.decimals);
          }
          if (query.amountFrom) {
            where.amount[Op.gte] = BigNumber(query.amountFrom).multipliedBy(10 ** currency.decimals);
          }
          if (query.amountTo) {
            where.amount[Op.lte] = BigNumber(query.amountTo).multipliedBy(10 ** currency.decimals);
          }
        }
      }

      const items = await MemberAssets.findAll({
        where: where,
        order: [['created_at', 'DESC']]
      });

      const listCrrencies = await Currencies.findAll({});
      items.forEach(item => {
        item.created_at = moment(item.createdAt).add(- timezone_offset, 'minutes').format('YYYY-MM-DD HH:mm');
        const currency = listCrrencies.find(curr => curr.platform === item.platform);
        if (currency) {
          item.balance = BigNumber(item.balance).div(10 ** currency.decimals).toString(10) + ' ' + currency.platform;
          item.amount = BigNumber(item.amount).div(10 ** currency.decimals).toString(10) + ' ' + currency.platform;
          item.reward = BigNumber(item.reward).div(10 ** currency.decimals).toString(10) + ' ' + currency.platform;
        }
      });

      const data = await stringifyAsync(items, [
        { key: 'created_at', header: 'Date' },
        { key: 'platform', header: 'Platform' },
        { key: 'address', header: 'Address' },
        { key: 'balance', header: 'Balance' },
        { key: 'amount', header: 'Staked Amount' },
        { key: 'reward', header: 'Rewards' },
      ]);
      res.setHeader('Content-disposition', 'attachment; filename=member-assets.csv');
      res.set('Content-Type', 'text/csv');
      res.send(data);
    }
    catch (error) {
      logger.error('search member asset fail', error);
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
