const { Temporalize } = require('sequelize-temporalize');
const Status = require("./value-object/nexo-transaction-status");
const Type = require("./value-object/nexo-transaction-type");

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("nexo_transactions", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4()
    },
    wallet_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    nexo_member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    nexo_id: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    device_code: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: Status.NEW
    },
    type: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: Type.WITHDRAW
    },
    platform: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    nexo_currency_id: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    total_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    memo: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    short_name: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    tx_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    response: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  Temporalize({
    model: Model,
    sequelize,
    temporalizeOptions: {
      blocking: false,
      full: false,
      modelSuffix: "_his"
    }
  });

  Model.associate = (models) => {
    Model.belongsTo(models.nexo_members, {
      as: 'NexoMember',
      foreignKey: 'nexo_member_id',
      targetKey: 'id'
    });
  };

  return Model;
} 