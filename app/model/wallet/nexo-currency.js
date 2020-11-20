const Status = require("./value-object/nexo-currency-status");
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("nexo_currencies", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    symbol: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Status.ENABLED
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['symbol']
      }
    ]
  });

  return Model;
};
