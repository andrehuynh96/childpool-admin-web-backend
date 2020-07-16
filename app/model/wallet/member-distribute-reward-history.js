const MemberDistributeRewardStatus = require("./value-object/member-distribute-reward-status");

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("member_distribute_reward_his", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    claim_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currency_symbol: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: MemberDistributeRewardStatus.PENDING
    },
    tx_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    memo: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    transaction_log: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });
  Model.associate = (models) => {
    Model.belongsTo(models.claim_requests, {
      as: 'ClaimRequest',
      foreignKey: 'claim_request_id',
      targetKey: 'id'
    });
  };
  return Model;
};