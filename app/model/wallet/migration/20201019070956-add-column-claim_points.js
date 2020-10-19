'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('membership_types')
          .then(async (tableDefinition) => {
            if (tableDefinition['claim_points']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('membership_types', 'claim_points', {
              type: Sequelize.INTEGER,
              allowNull: true
            });

            const updateSilverSQL = `UPDATE membership_types SET claim_points = 1 where name='Silver' `;
            await queryInterface.sequelize.query(updateSilverSQL, {}, {});

            const updateGoldSQL = `UPDATE membership_types SET claim_points = 5 where name='Gold' `;
            await queryInterface.sequelize.query(updateGoldSQL, {}, {});

            const updatePlatinumSQL = `UPDATE membership_types SET claim_points = 10 where name='Platinum' `;
            await queryInterface.sequelize.query(updatePlatinumSQL, {}, {});

            return Promise.resolve();
          })
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('members', 'membership_type_id_bk', { transaction: t }),
      ]);
    });
  }
};
