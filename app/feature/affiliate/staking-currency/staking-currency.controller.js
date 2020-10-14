const _ = require('lodash');
const logger = require('app/lib/logger');
const config = require("app/config");
const Currency = require("app/model/wallet").currencies;
const currencyMapper = require("app/feature/response-schema/currency.response-schema");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  getStakingCurrencies: async (req, res, next) => {
    try {
      const stakingCurrencySymbols = config.stakingCurrency.split(',').map(item => _.trim(item));
      const currencies = await Currency.findAll({
        where: {
          symbol: {
            [Op.in]: stakingCurrencySymbols,
          },
        },
        order: [['order_index', 'ASC'], ['created_at', 'DESC']],
      });

      currencies.forEach(item => {
        item.full_name = item.name;
        item.currency_symbol = item.symbol;
        item.name = item.currency_symbol;
      });

      return res.ok(currencyMapper(currencies));
    }
    catch (error) {
      logger.error("get staking currency list fail", error);
      next(error);
    }
  },
};
