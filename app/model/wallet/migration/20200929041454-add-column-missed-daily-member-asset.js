'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_assets')
          .then(async (tableDefinition) => {
            if (tableDefinition['missed_daily']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('member_assets', 'missed_daily', {
              type: Sequelize.DataTypes.BOOLEAN,
              allowNull: false,
              defaultValue: false
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
        queryInterface.removeColumn('member_assets', 'missed_daily', { transaction: t }),
      ]);
    });
  }
};
