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
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    num_of_views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    mail_message_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    diagnostic_code: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
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
    indexes: [
      {
        fields: [
          'mail_message_id',
          'email'
        ],
      }
    ],
  });

  return Model;
};
