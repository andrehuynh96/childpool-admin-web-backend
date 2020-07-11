'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'user_ips',
      'client_ip',
      {
        type: Sequelize.DataTypes.STRING(200),
        allowNull: true
      }
    )
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
      'user_ips',
      'client_ip',
      {
        type: Sequelize.DataTypes.STRING(32),
        allowNull: true
      }
    )
  }
};


