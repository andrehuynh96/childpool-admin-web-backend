module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user_ips", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    client_ip: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    allow_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    verify_token: {
      type: DataTypes.STRING(128),
      allowNull: false
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