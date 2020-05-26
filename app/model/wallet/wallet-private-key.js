const { Temporalize } = require('sequelize-temporalize');
module.exports = (sequelize, DataTypes) => {
  const WalletPrivKey = sequelize.define("wallet_priv_keys", {
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
    platform: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    hd_path: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    encrypted_private_key: {
      type: DataTypes.STRING(512),
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
  Temporalize({
    model: WalletPrivKey,
    sequelize,
    temporalizeOptions: {
      blocking: false,
      full: false,
      modelSuffix: "_his"
    }
  });

  WalletPrivKey.associate = (models) => {
    WalletPrivKey.belongsTo(models.wallets, { foreignKey: 'wallet_id', targetKey: 'id' })
  };
  return WalletPrivKey;
} 