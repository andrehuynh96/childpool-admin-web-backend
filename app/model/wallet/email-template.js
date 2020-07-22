const { Temporalize } = require('sequelize-temporalize');
module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define("email_templates", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    organization: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    subject:{
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    template: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING(100),
      allowNull: true
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
    model: Wallet,
    sequelize,
    temporalizeOptions: {
      blocking: false,
      full: false,
      modelSuffix: "_his"
    }
  });

  Wallet.associate = (models) => {
    Wallet.hasMany(models.wallet_tokens, { foreignKey: 'wallet_id', as: "tokens" });
    Wallet.hasMany(models.wallet_priv_keys, { foreignKey: 'wallet_id', as: "privKeys" });
    Wallet.belongsTo(models.members, { foreignKey: 'member_id', targetKey: 'id', as: "member" });
  };
  return Wallet;
}   