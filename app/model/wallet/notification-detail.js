module.exports = (sequelize, DataTypes) => {
  let Model = sequelize.define("notification_details", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    notification_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    read_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      default: false,
    }
  }, {
    underscored: true,
    timestamps: true,
  });

  Model.associate = (models) => {
    Model.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
    });

    Model.belongsTo(models.notifications, {
      as: 'Notification',
      foreignKey: 'notification_id',
    });
  };

  return Model;
};
