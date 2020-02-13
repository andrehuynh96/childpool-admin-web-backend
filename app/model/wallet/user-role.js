
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define("user_roles", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });
  UserRole.associate = (models) => {
    // associations can be defined here
    UserRole.belongsTo(models.users, { foreignKey: 'user_id' })
    UserRole.belongsTo(models.roles, { foreignKey: 'role_id' })
  };

  return UserRole;
} 