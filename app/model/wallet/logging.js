module.exports = (sequelize, DataTypes) => {
  return sequelize.define("loggings", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING(125),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT('medium'),
      allowNull: false,
    },
  }, {
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'logging_type_01',
        fields: [
          {
            attribute: 'created_at',
            order: 'DESC',
          },
          {
            attribute: 'type',
            order: 'DESC',
          },
        ]
      },
    ],

  });
};
