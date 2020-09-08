'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // eslint-disable-next-line no-unused-vars
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('kyc_properties')
          .then(async (tableDefinition) => {
            if (tableDefinition['max_length']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('kyc_properties', 'max_length', {
              type: Sequelize.DataTypes.INTEGER,
              allowNull: true,
              defaultValue: null,
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
        queryInterface.removeColumn('kyc_properties', 'max_length', { transaction: t }),
      ]);
    });
  }
};
