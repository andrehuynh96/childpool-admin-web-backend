'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // eslint-disable-next-line no-unused-vars
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('member_assets')
          .then(async (tableDefinition) => {
            if (tableDefinition['member_id']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('member_assets', 'member_id', {
              type: Sequelize.DataTypes.UUID,
              allowNull: false
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
        queryInterface.removeColumn('member_assets', 'member_id', { transaction: t }),
      ]);
    });
  }
};
