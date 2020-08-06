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
    group_name: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 0
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
