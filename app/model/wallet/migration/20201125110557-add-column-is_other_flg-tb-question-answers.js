'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('question_answers')
          .then(async (tableDefinition) => {
            if (tableDefinition['is_other_flg']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('question_answers', 'is_other_flg', {
              type: Sequelize.DataTypes.BOOLEAN,
              allowNull: true,
              defaultValue: false
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
        queryInterface.removeColumn('question_answers', 'is_other_flg', { transaction: t }),
      ]);
    });
  }
};
