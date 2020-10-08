module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("blacklist_emails", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    bounce_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    bounce_sub_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    diagnostic_code: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
  }, {
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: [
          'email'
        ],
      }
    ],
  });

  return Model;
};
