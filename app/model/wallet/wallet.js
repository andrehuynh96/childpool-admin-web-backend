module.exports = (sequelize, DataTypes) => {
  return sequelize.define("wallets", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    default_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    key_store_path: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    user_wallet_pass_hash: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING(64),
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
} 