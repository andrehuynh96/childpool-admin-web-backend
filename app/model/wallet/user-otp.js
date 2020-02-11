module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user_otps", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    expired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 0
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action_type: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
} 