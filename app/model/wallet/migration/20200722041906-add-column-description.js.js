'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('receiving_addresses')
          .then(async (tableDefinition) => {
            if (tableDefinition['description']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('receiving_addresses', 'description', {
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
        queryInterface.removeColumn('receiving_addresses', 'description', { transaction: t }),
      ]);
    });
  }
};


