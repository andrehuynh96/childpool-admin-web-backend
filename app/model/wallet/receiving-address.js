module.exports = (sequelize, DataTypes) => {
  const ReceivingAddress = sequelize.define('receiving_addresses', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    currency_symbol: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    wallet_address: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    actived_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true,
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {
      underscored: true,
      timestamps: true,
    });

  return ReceivingAddress;
};
