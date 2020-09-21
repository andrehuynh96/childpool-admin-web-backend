const ClaimRequestStatus = require("./value-object/claim-request-status");
const SystemType = require('./value-object/system-type');

module.exports = (sequelize, DataTypes) => {
  const ClaimRequest = sequelize.define("claim_requests", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    member_account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ClaimRequestStatus.Pending
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    currency_symbol: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    bank_name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    branch_name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    account_holder: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    wallet_address: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    txid: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    affiliate_claim_reward_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    system_type: {
      type: DataTypes.STRING(125),
      allowNull: true,
      defaultValue: SystemType.MEMBERSHIP
    },
    payout_transferred: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    original_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    network_fee: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  }, {
      underscored: true,
      timestamps: true,
    });

  ClaimRequest.associate = (models) => {
    ClaimRequest.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
    });

    ClaimRequest.belongsTo(models.member_accounts, {
      as: 'MemberAccount',
      foreignKey: 'member_account_id',
    });
  };

  return ClaimRequest;
};