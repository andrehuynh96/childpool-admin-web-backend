'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_assets')
          .then(async (tableDefinition) => {
            if (tableDefinition['version']) {
              return Promise.resolve();
            }
            await queryInterface.addColumn('member_assets', 'version', {
              type: Sequelize.DataTypes.STRING(128),
              allowNull: true,
            });
            return Promise.resolve();
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('member_assets', 'version', { transaction: t }),
      ]);
    });
  }
};
