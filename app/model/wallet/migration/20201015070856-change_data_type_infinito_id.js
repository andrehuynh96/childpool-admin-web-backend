'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('members', 'infinito_id', {
          type: Sequelize.DataTypes.STRING(64),
          allowNull: true,
        }, { transaction: t })
      ]);
    });

  },

  down: (queryInterface, Sequelize) => {

  }
};
