'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('membership_types')
          .then(async (tableDefinition) => {
            if (tableDefinition['key']) {
              return Promise.resolve();
            }
            await queryInterface.addColumn('membership_types', 'key', {
              type: Sequelize.DataTypes.STRING(100),
              allowNull: true
            });

            const updateSqlCmd = `UPDATE membership_types SET key=upper(name);`;
            await queryInterface.sequelize.query(updateSqlCmd,{},{});

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
