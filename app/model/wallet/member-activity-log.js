const ActionType = require("./value-object/member-activity-action-type");
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("member_activity_logs", {
    member_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    client_ip: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    action: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ActionType.LOGIN
    },
    user_agent: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    data: {
      type: DataTypes.STRING(1024),
      allowNull: true
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 