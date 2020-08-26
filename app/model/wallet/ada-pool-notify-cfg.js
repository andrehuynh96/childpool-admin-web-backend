const CurrencyStatus = require("./value-object/currency-status");
const CurrencyType = require("./value-object/currency-type");
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("ada_pool_notify_cfgs", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    size: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    emails: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });
  return Model;
} 