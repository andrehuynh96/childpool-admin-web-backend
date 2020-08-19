'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('membership_orders')
          .then(async (tableDefinition) => {
            if (tableDefinition['recalculate_reward']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('membership_orders', 'recalculate_reward', {
              type: Sequelize.DataTypes.BOOLEAN,
              allowNull: true,
              default: false,
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
        queryInterface.removeColumn('membership_orders', 'recalculate_reward', { transaction: t }),
      ]);
    });
  }
};
