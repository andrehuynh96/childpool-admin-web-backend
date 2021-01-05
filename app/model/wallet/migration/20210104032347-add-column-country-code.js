'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('users')
          .then(async (tableDefinition) => {
            if (tableDefinition['country_code']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('users', 'country_code', {
              type: Sequelize.DataTypes.STRING(100),
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
        queryInterface.removeColumn('users', 'country_code', { transaction: t }),
      ]);
    });
  }
};
