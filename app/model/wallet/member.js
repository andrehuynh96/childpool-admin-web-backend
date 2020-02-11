const MemberStatus = require("./value-object/member-status");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("members", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      //unique: true
    },
    password_hash: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    member_sts: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: MemberStatus.UNACTIVATED
    },
    fullname: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: false,
      // unique: true,
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    post_code: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    twofa_secret: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    twofa_enable_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    twofa_download_key_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    referral_code: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    referrer_code: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    infinito_id: {
      type: DataTypes.STRING(32),
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