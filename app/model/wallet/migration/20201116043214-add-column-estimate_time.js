'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('questions')
          .then(async (tableDefinition) => {
            if (tableDefinition['estimate_time']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('questions', 'estimate_time', {
              type: Sequelize.DataTypes.INTEGER,
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
        queryInterface.removeColumn('questions', 'estimate_time', { transaction: t }),
      ]);
    });
  }
};
