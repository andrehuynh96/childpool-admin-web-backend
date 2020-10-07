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
              const updateSQL = `Update currencies Set web_site_url = '${item.web_site_url}' Where symbol = '${item.currencySymbol}'`;
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
