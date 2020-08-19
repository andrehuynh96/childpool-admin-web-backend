const CurrencyStatus = require("./value-object/currency-status");
const CurrencyType = require("./value-object/currency-type");
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("ada_pools", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });
  return Model;
} 