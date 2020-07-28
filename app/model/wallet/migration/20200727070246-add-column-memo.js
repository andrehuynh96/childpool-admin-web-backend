'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('bank_accounts')
          .then(async (tableDefinition) => {
            if (tableDefinition['memo']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('bank_accounts', 'memo', {
              type: Sequelize.DataTypes.STRING(1000),
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
        queryInterface.removeColumn('bank_accounts', 'memo', { transaction: t }),
      ]);
    });
  }
};


