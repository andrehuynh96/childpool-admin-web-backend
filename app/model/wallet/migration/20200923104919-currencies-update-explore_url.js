/* eslint-disable no-unused-vars */
'use strict';
const _ = require('lodash');
const Explorer = require('app/model/wallet/value-object/explorer');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('currencies')
          .then(async (tableDefinition) => {
            const { explorer } = Explorer;
            for (let item of explorer) { // for testnet
              const updateSQL = `Update currencies Set ( explore_url, transaction_format_link, address_format_link ) =('${item.url}', '${item.transactionFormatLink}','${item.addressFormatLink}') Where symbol = '${item.currencySymbol}'`;
              await queryInterface.sequelize.query(updateSQL, {}, {});
            }
            return Promise.resolve();
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
