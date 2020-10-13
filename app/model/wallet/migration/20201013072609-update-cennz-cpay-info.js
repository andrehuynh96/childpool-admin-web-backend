/* eslint-disable no-unused-vars */
'use strict';
const _ = require('lodash');
const items = require('./explorer-data.json');

const getValueOrNull = (text) => {
  if (text === null) {
    return 'NULL';
  }

  return `'${text}'`;
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('currencies')
          .then(async (tableDefinition) => {
            const filterItems = items.filter(item => item.currencySymbol === "CENNZ" || item.currencySymbol === "CPAY");

            for (let item of filterItems) {
              const updateSQL = `
                update currencies set
                  decimals = ${getValueOrNull(item.decimals)},
                  explore_url = ${getValueOrNull(item.url)},
                  transaction_format_link = ${getValueOrNull(item.transactionFormatLink)},
                  address_format_link = ${getValueOrNull(item.addressFormatLink)},
                  web_site_url = ${getValueOrNull(item.web_site_url)}
                where symbol = '${item.currencySymbol}'
              `;

              console.log(updateSQL);
              await queryInterface.sequelize.query(updateSQL, {}, {});
            }

          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
