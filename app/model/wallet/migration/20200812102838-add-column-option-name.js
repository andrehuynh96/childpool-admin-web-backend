'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('email_templates')
          .then(async (tableDefinition) => {
            if (!tableDefinition['option_name']) {
              await queryInterface.addColumn('email_templates', 'option_name', {
                type: Sequelize.DataTypes.STRING(256),
                allowNull: true,
              });
            }

            if (!tableDefinition['key']) {
              await queryInterface.addColumn('email_templates', 'key', {
                type: Sequelize.DataTypes.STRING(256),
                allowNull: true,
              });
            }

            return Promise.resolve();
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('email_templates', 'option_name', { transaction: t }),
        queryInterface.removeColumn('email_templates', 'key', { transaction: t }),
      ]);
    });
  }
};
