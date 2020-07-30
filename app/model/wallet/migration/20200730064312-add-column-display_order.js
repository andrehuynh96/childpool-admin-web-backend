'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('email_templates')
          .then(async (tableDefinition) => {
            if (tableDefinition['display_order']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('email_templates', 'display_order', {
              type: Sequelize.DataTypes.INTEGER,
              allowNull: true
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
        queryInterface.removeColumn('email_templates', 'display_order', { transaction: t }),
      ]);
    });
  }
};
