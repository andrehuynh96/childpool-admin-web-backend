'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('permissions')
          .then(async (tableDefinition) => {
            if (tableDefinition['group_name']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('permissions', 'group_name', {
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
        queryInterface.removeColumn('permissions', 'group_name', { transaction: t }),
      ]);
    });
  }
};


