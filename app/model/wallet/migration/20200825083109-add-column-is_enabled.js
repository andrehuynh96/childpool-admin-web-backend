'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // eslint-disable-next-line no-unused-vars
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('ada_pool_notify_cfgs')
          .then(async (tableDefinition) => {
            if (tableDefinition['is_enabled']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('ada_pool_notify_cfgs', 'is_enabled', {
              type: Sequelize.DataTypes.BOOLEAN,
              allowNull: true,
              default: true,
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
        queryInterface.removeColumn('ada_pool_notify_cfgs', 'is_enabled', { transaction: t }),
      ]);
    });
  }
};
