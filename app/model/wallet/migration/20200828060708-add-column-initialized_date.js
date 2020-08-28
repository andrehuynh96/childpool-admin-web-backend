'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // eslint-disable-next-line no-unused-vars
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('permissions')
          .then(async (tableDefinition) => {
            if (tableDefinition['initialized_date']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('permissions', 'initialized_date', {
              type: Sequelize.DataTypes.DATE,
              allowNull: true,
              defaultValue: null,
            });

            const sql = 'UPDATE permissions SET initialized_date=created_at where initialized_date IS NULL;';
            await queryInterface.sequelize.query(sql, {}, {});

            return Promise.resolve();
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('permissions', 'initialized_date', { transaction: t }),
      ]);
    });
  }
};
