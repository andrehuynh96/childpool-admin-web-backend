'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('exchange_currencies')
          .then(async (tableDefinition) => {
            if (tableDefinition['turn_off_by_job_flg']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('exchange_currencies', 'turn_off_by_job_flg', {
              type: Sequelize.DataTypes.BOOLEAN,
              allowNull: true,
              defaultValue: false
            });

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
