module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("email_loggings", {
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
    subject: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    num_of_views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    error_message: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    sent_result: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  return Model;
};
