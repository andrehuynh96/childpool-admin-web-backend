module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('member_assets', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    platform: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    balance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    reward: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
  },{
    underscored: true,
    timestamps: true,
  });

  return Model;
};
