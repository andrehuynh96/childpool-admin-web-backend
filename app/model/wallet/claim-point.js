const ClaimPointStatus = require("./value-object/claim-point-status");
const SystemType = require('./value-object/system-type');

module.exports = (sequelize, DataTypes) => {
  const ClaimPoint = sequelize.define("claim_points", {
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
      defaultValue: ClaimPointStatus.Pending
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
  }, {
    underscored: true,
    timestamps: true,
    indexes: [
      {
        name: 'claim_points_amount_01',
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

  ClaimPoint.associate = (models) => {
    ClaimPoint.belongsTo(models.members, {
      as: 'Member',
      foreignKey: 'member_id',
    });
  };

  return ClaimPoint;
};
