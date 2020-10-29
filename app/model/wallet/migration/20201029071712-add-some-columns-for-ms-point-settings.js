'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('membership_types')
          .then(async (tableDefinition) => {
            if (tableDefinition['staking_points']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('membership_types', 'staking_points', {
              type: Sequelize.INTEGER,
              allowNull: true
            });

            return Promise.resolve();
          }),

        queryInterface.describeTable('membership_types')
          .then(async (tableDefinition) => {
            if (tableDefinition['upgrade_membership_points']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('membership_types', 'upgrade_membership_points', {
              type: Sequelize.INTEGER,
              allowNull: true
            });

            return Promise.resolve();
          }),

        queryInterface.describeTable('membership_types')
          .then(async (tableDefinition) => {
            if (tableDefinition['exchange_points']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('membership_types', 'exchange_points', {
              type: Sequelize.INTEGER,
              allowNull: true
            });

            return Promise.resolve();
          }),

      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('members', 'staking_points', { transaction: t }),
        queryInterface.removeColumn('members', 'upgrade_membership_points', { transaction: t }),
        queryInterface.removeColumn('members', 'exchange_points', { transaction: t }),
      ]);
    });
  }
};
