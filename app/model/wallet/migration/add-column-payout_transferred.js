'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('claim_requests')
          .then(async (tableDefinition) => {
            if (tableDefinition['payout_transferred']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('claim_request', 'payout_transferred', {
              type: Sequelize.DataTypes.DATE,
              allowNull: true,
            });

            return Promise.resolve();
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('claim_request', 'payout_transferred', { transaction: t }),
      ]);
    });
  }
};