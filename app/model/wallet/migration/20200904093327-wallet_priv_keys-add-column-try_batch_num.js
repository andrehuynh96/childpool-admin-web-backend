'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('wallet_priv_keys')
          .then(async (tableDefinition) => {
            if (tableDefinition['try_batch_num']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('wallet_priv_keys', 'try_batch_num', {
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
        queryInterface.removeColumn('wallet_priv_keys', 'try_batch_num', { transaction: t }),
      ]);
    });
  }
};
