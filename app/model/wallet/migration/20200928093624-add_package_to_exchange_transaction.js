'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('exchange_transactions')
          .then(async (tableDefinition) => {
            if (tableDefinition['provider_track_url']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('exchange_transactions', 'provider_track_url', {
              type: Sequelize.DataTypes.STRING(256),
              allowNull: true,
            });
            return Promise.resolve();
          }),
        queryInterface.describeTable('exchange_transactions')
          .then(async (tableDefinition) => {
            if (tableDefinition['payout_tx_id']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('exchange_transactions', 'payout_tx_id', {
              type: Sequelize.DataTypes.STRING(256),
              allowNull: true,
            });
            return Promise.resolve();
          }),
        queryInterface.describeTable('exchange_transactions')
          .then(async (tableDefinition) => {
            if (tableDefinition['network_fee']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('exchange_transactions', 'network_fee', {
              type: Sequelize.DataTypes.DECIMAL,
              allowNull: true,
              defaultValue: 0
            });
            return Promise.resolve();
          }),
        queryInterface.describeTable('exchange_transactions')
          .then(async (tableDefinition) => {
            if (tableDefinition['total_fee']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('exchange_transactions', 'total_fee', {
              type: Sequelize.DataTypes.DECIMAL,
              allowNull: true,
              defaultValue: 0
            });
            return Promise.resolve();
          }),
        queryInterface.describeTable('exchange_transactions')
          .then(async (tableDefinition) => {
            if (tableDefinition['rate']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('exchange_transactions', 'rate', {
              type: Sequelize.DataTypes.DECIMAL,
              allowNull: true,
              defaultValue: 0
            });
            return Promise.resolve();
          }),
        queryInterface.describeTable('exchange_transactions')
          .then(async (tableDefinition) => {
            if (tableDefinition['amount_from']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('exchange_transactions', 'amount_from', {
              type: Sequelize.DataTypes.DECIMAL,
              allowNull: true,
              defaultValue: 0
            });
            return Promise.resolve();
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
