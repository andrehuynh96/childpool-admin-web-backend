const KycStatus = require('./value-object/kyc-status');
const { Temporalize } = require('sequelize-temporalize');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('member_kycs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    kyc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: KycStatus.IN_REVIEW
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
    Model.belongsTo(models.kycs, {
      as: 'Kyc',
      foreignKey: 'kyc_id',
      targetKey: 'id'
    });
  };

  return Model;
};
