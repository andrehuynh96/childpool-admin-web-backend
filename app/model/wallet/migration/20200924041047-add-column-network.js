'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('currencies')
          .then(async (tableDefinition) => {
            if (tableDefinition['network']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('currencies', 'network', {
              type: Sequelize.DataTypes.STRING(128),
              allowNull: false,
              defaultValue: '',
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
        queryInterface.removeColumn('currencies', 'network', { transaction: t }),
      ]);
    });
  }
};
