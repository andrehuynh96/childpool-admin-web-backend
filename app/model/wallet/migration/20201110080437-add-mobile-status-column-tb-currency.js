'use strict';
const CurrencyStatus = require("./../value-object/currency-status");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('currencies')
          .then(async (tableDefinition) => {
            if (tableDefinition['mobile_status']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('currencies', 'mobile_status', {
              type: Sequelize.DataTypes.INTEGER,
              allowNull: false,
              defaultValue: CurrencyStatus.ENABLED
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
        queryInterface.removeColumn('currencies', 'mobile_status', { transaction: t }),
      ]);
    });
  }
};
