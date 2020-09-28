const Type = require("./value-object/notification-type");
const Event = require("./value-object/notification-event");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("notifications", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    title_ja: {
      type: DataTypes.TEXT('medium'),
      allowNull: true,
    },
    content_ja: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: Type.SYSTEM
    },
    event: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: Event.NEW_INFORMATION
    },
    sent_all_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true,
    },
    actived_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true,
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      default: false,
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
    }
  }, {
    underscored: true,
    timestamps: true,
  });
};
