module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("email_templates", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    template: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    underscored: true,
    timestamps: true,
  });

  return Model;
};
