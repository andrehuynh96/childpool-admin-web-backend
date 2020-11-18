'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('questions')
          .then(async (tableDefinition) => {
            if (tableDefinition['sub_type']) {
              return Promise.resolve();
            }
            await queryInterface.addColumn('questions', 'sub_type', {
              type: Sequelize.DataTypes.STRING(100),
              allowNull: true
            });

            const updateSubTypeSQL = `UPDATE questions SET sub_type='QUESTIONNAIRE' `;
            await queryInterface.sequelize.query(updateSubTypeSQL,{},{});

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
