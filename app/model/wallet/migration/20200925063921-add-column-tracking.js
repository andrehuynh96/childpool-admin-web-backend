'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_assets')
          .then(async (tableDefinition) => {
            if (tableDefinition['tracking']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('member_assets', 'tracking', {
              type: Sequelize.DataTypes.JSON,
              allowNull: true
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
        queryInterface.removeColumn('member_assets', 'tracking', { transaction: t }),
      ]);
    });
  }
};
