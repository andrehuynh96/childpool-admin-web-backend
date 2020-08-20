'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('membership_orders')
          .then(async (tableDefinition) => {
            if (tableDefinition['updated_description_at']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('membership_orders', 'updated_description_at', {
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
        queryInterface.removeColumn('membership_orders', 'updated_description_at', { transaction: t }),
      ]);
    });
  }
};


