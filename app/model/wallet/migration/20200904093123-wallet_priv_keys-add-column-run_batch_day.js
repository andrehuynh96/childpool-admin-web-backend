'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('wallet_priv_keys')
          .then(async (tableDefinition) => {
            if (tableDefinition['run_batch_day']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('wallet_priv_keys', 'run_batch_day', {
              type: Sequelize.DataTypes.INTEGER,
              allowNull: true,
              defaultValue: 0
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
        queryInterface.removeColumn('wallet_priv_keys', 'run_batch_day', { transaction: t }),
      ]);
    });
  }
};
