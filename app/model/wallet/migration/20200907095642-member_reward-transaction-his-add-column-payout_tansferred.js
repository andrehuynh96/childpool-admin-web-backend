'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_reward_transaction_his')
          .then(async (tableDefinition) => {
            if (tableDefinition['payout_transferred']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('member_reward_transaction_his', 'payout_transferred', {
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
        queryInterface.removeColumn('member_reward_transaction_his', 'payout_transferred', { transaction: t }),
      ]);
    });
  }
};
