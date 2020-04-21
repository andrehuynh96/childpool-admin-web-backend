module.exports = (sequelize, DataTypes) => {
  const WalletToken = sequelize.define("wallet_tokens", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    wallet_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    sc_token_address: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    decimals: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    platform: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
      underscored: true,
      timestamps: true,
    });

  WalletToken.associate = (models) => {
    WalletToken.belongsTo(models.wallets, { foreignKey: 'wallet_id', targetKey: 'id' })
  };
  return WalletToken;
} 