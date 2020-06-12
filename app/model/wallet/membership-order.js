const UserAccountType = require('./value-object/member-account-type');
const MembershipOrderStatus = require('./value-object/membership-order-status');

module.exports = (sequelize, DataTypes) => {
  const MembershipOrder = sequelize.define('membership_orders', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    member_account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    membership_type_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    payment_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: UserAccountType.BANK
    },
    currency_symbol: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    bank_name: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    bracnch_name: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    account_holder: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    payment_ref_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    memo: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    wallet_address: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    txid: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    rate_by_usdt: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: MembershipOrderStatus.Pending
    },
    notes: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    approved_by_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  MembershipOrder.associate = (models) => {
    MembershipOrder.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
    });

    MembershipOrder.belongsTo(models.member_accounts, {
      as: 'MemberAccount',
      foreignKey: 'member_account_id',
    });

    MembershipOrder.belongsTo(models.membership_types, {
      as: 'MembershipType',
      foreignKey: 'membership_type_id',
    });

  };

  return MembershipOrder;
};
