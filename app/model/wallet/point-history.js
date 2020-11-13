const PointStatus = require("./value-object/point-status");
const SystemType = require('./value-object/system-type');
const PointAction = require("./value-object/point-action");

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("point_histories", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: PointStatus.PENDING
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: PointAction.CLAIM
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    currency_symbol: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    system_type: {
      type: DataTypes.STRING(125),
      allowNull: true,
      defaultValue: SystemType.MEMBERSHIP
    },
    tx_id: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: true,
    },
  }, {
      underscored: true,
      timestamps: true,
      indexes: [
        {
          name: 'point_historis_amount_01',
          fields: [
            {
              attribute: 'created_at',
              order: 'DESC',
            },
            {
              attribute: 'member_id',
              order: 'DESC',
            },
            {
              attribute: 'currency_symbol',
              order: 'ASC',
            },
            'amount']
        },
      ],
    });

  Model.associate = (models) => {
    Model.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
    });
  };

  return Model;
};
