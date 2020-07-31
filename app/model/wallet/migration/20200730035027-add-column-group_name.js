'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('email_templates')
          .then(async (tableDefinition) => {
            if (tableDefinition['group_name']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('email_templates', 'group_name', {
              type: Sequelize.DataTypes.STRING(256),
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
        queryInterface.removeColumn('email_templates', 'group_name', { transaction: t }),
      ]);
    });
  }
};
