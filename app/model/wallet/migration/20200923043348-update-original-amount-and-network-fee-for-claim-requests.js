/* eslint-disable no-unused-vars */
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('claim_requests')
          .then(async (tableDefinition) => {
            const updateOriginalAmountSql = `UPDATE claim_requests SET original_amount = amount WHERE original_amount IS NULL;`;
            const updateNetworkFeeSql = `UPDATE claim_requests SET network_fee = 0 WHERE network_fee IS NULL;`;
            await queryInterface.sequelize.query(updateOriginalAmountSql, {}, {});
            await queryInterface.sequelize.query(updateNetworkFeeSql, {}, {});
            return Promise.resolve();
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
