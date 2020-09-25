'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // eslint-disable-next-line no-unused-vars
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_assets')
          .then(async (tableDefinition) => {
            if (tableDefinition['email']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('member_assets', 'email', {
              type: Sequelize.DataTypes.STRING(128),
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
        queryInterface.removeColumn('member_assets', 'email', { transaction: t }),
      ]);
    });
  }
};
