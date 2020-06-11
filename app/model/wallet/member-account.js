const UserAccountType = require('./value-object/member-account-type');

module.exports = (sequelize, DataTypes) => {
  const MemberAccount = sequelize.define('member_accounts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: UserAccountType.BANK
    },
    currency_symbol: {
      type: DataTypes.STRING(50),
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
    branch_name: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    account_holder: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    wallet_address: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      default: false,
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  MemberAccount.associate = (models) => {
    MemberAccount.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
    });

  };

  return MemberAccount;
};
