'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('currencies')
          .then(async (tableDefinition) => {
            if (tableDefinition['address_format_link']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('currencies', 'address_format_link', {
              type: Sequelize.DataTypes.STRING(500),
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
        queryInterface.removeColumn('currencies', 'address_format_link', { transaction: t }),
      ]);
    });
  }
};
