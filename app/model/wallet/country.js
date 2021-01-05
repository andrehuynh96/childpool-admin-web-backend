
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("countries", {
    code: {
      type: DataTypes.STRING(128),
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    actived_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true,
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  return Model;
};
