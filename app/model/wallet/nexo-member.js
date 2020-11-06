const Status = require("./value-object/nexo-member-status");

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("nexo_members", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    nexo_id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },
    last_name: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: Status.UNACTIVATED
    },
    user_secret: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    device_code: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  Model.associate = (models) => {
    Model.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
      targetKey: 'id'
    });
  };

  return Model;
} 