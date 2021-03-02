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
    unclaim_reward: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    tracking: {
      type: DataTypes.JSON,
      allowNull: true
    },
    missed_daily: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    version: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  return Model;
};
