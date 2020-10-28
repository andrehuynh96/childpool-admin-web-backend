'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('loggings')
          .then(async (tableDefinition) => {
            if (tableDefinition['wallet_address']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('loggings', 'wallet_address', {
              type: Sequelize.DataTypes.STRING(500),
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
        queryInterface.removeColumn('loggings', 'wallet_address', { transaction: t }),
      ]);
    });
  }
};
