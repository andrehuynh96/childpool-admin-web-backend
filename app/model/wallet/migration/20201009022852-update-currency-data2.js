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
            const updateSQL = `
                update currencies set decimals=0 where symbol = 'ONT';
                update currencies set decimals=8 where symbol = 'QTUM';
                update currencies set decimals=6 where symbol = 'USDT';
                `;
            await queryInterface.sequelize.query(updateSQL, {}, {});

            return Promise.resolve();
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
