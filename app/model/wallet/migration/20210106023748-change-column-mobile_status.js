'use strict';
const CurrencyStatus = require("./../value-object/currency-status");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('currencies')
          .then(async (tableDefinition) => {
            if (!tableDefinition['mobile_ios_status']) {
              await queryInterface.renameColumn('currencies', 'mobile_status','mobile_ios_status');
            }

            if (!tableDefinition['mobile_android_status']) {
              await queryInterface.addColumn('currencies', 'mobile_android_status', {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: CurrencyStatus.ENABLED
              });
            }

            return Promise.resolve();
          })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
