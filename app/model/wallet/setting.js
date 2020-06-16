
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("settings", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(256),
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
    type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    property: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 