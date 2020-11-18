'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('questions')
          .then(async (tableDefinition) => {
            if (tableDefinition['survey_id']) {
              return Promise.resolve();
            }
            await queryInterface.addColumn('questions', 'survey_id', {
              type: Sequelize.DataTypes.UUID,
              allowNull: true
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
