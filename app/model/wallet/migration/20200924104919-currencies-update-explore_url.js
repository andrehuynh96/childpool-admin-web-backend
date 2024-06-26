/* eslint-disable no-unused-vars */
'use strict';
const _ = require('lodash');
const items = require('./explorer-data.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('currencies')
          .then(async (tableDefinition) => {
            for (let item of items) {
              const updateSQL = `Update currencies Set (decimals, explore_url, transaction_format_link, address_format_link ) = (${item.decimals},'${item.url}', '${item.transactionFormatLink}','${item.addressFormatLink}') Where symbol = '${item.currencySymbol}'`;
              await queryInterface.sequelize.query(updateSQL, {}, {});
            }

            const updateNetworkSQL = `Update currencies Set network='mainnet' where network='' Or network is null`;
            await queryInterface.sequelize.query(updateNetworkSQL, {}, {});
            return Promise.resolve();
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
