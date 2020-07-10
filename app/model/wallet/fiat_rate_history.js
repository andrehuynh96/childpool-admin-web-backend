
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("fiat_rate_histories", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rate: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    currency_exchange: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 