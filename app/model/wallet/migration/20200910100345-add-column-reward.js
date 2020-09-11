'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // eslint-disable-next-line no-unused-vars
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_assets')
          .then(async (tableDefinition) => {
            if (tableDefinition['reward']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('member_assets', 'reward', {
              type: Sequelize.DataTypes.DOUBLE,
              allowNull: false,
              defaultValue: 0
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
        queryInterface.removeColumn('member_assets', 'reward', { transaction: t }),
      ]);
    });
  }
};
