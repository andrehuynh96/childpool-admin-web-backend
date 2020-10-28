'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.describeTable('members')
          .then(async (tableDefinition) => {
            if (tableDefinition['membership_type_id_bk']) {
              return Promise.resolve();
            }

            await queryInterface.addColumn('members', 'membership_type_id_bk', {
              type: Sequelize.DataTypes.UUID,
              allowNull: true,
            });

            const backupMembershipTypeIdSql = `UPDATE members SET membership_type_id_bk = membership_type_id`;
            await queryInterface.sequelize.query(backupMembershipTypeIdSql, {}, {});

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
