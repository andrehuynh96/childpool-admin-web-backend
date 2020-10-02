const { Temporalize } = require('sequelize-temporalize');
const Status = require("./value-object/exchange-transaction-status");
const Provider = require("./value-object/exchange-provider");

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("exchange_transactions", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4()
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    from_currency: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    to_currency: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    request_recipient_address: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    request_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    request_extra_id: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    request_refund_address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    request_refund_extra_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    provider_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    api_extra_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    payin_address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    payin_extra_id: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    payout_address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    payout_extra_id: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    provider_track_url: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    payout_tx_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    network_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    total_fee: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    rate: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    amount_from: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    amount_expected_from: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    amount_expected_to: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    amount_to: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: Status.NEW
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    provider: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: Provider.CHANGELLY
    },
    rate_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    response: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    tx_id: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    device_code: {
      type: DataTypes.STRING(256),
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
    Model.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
      targetKey: 'id'
    });
  };

  return Model;
};
