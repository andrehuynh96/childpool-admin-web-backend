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
    wallet_address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  }, {
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'logging_type_wallet_address_01',
        fields: [
          {
            attribute: 'created_at',
            order: 'DESC',
          },
          {
            attribute: 'type',
            order: 'DESC',
          },
          {
            attribute: 'wallet_address',
            order: 'DESC',
          },
        ]
      },
    ],

  });
};
