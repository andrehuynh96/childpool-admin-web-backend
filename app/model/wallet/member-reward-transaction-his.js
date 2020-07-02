const MemberRewardCommissionMethod = require("./value-object/member-reward-transaction-commission-method");
const MemberRewardAction = require("./value-object/member-reward-transaction-action");

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("member_reward_transaction_his", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    commission_method: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: MemberRewardCommissionMethod.NONE
    },
    commission_from: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    currency_symbol: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: MemberRewardAction.PAYOUT_REQUEST
    },
    tx_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });
  Model.associate = (models) => {
    Model.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
      targetKey: 'id'
    });
  };
  return Model;
} 