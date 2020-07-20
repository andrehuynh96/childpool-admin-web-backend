'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async(t) => {
      await queryInterface.changeColumn(
        'user_ips',
        'client_ip',
        {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: true
        },
        { transaction: t }
      )
      await queryInterface.changeColumn(
        'user_activity_logs',
        'client_ip',
        {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: true
        },
        { transaction: t }
      )
    })
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async(t) => {
      await queryInterface.changeColumn(
        'user_ips',
        'client_ip',
        {
          type: Sequelize.DataTypes.STRING(32),
          allowNull: true
        },
        { transaction: t }
      )
      await queryInterface.changeColumn(
        'user_activity_logs',
        'client_ip',
        {
          type: Sequelize.DataTypes.STRING(32),
          allowNull: true
        },
        { transaction: t }
      )
      return t.commit()
    })
  }
};


