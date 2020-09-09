module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("ada_pool_notify_his", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    epoch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slot: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    block:{
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    name:{
      type: DataTypes.STRING(250),
      allowNull: false
    },
    size:{
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
  return Model;
} 