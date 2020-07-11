'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn(
          'user_ips',
          'client_ip',
          {
            type: DataTypes.STRING(200),
            allowNull: true
          }
        )
      ]);
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
         queryInterface.changeColumn(
          'user_ips',
          'client_ip',
          {
            type: DataTypes.STRING(32),
            allowNull: true
          }
        )
      ]);
    });
  }
};


