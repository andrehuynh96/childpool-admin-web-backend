const KycDataType = require('./value-object/kyc-data-type');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('kyc_properties', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kyc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    field_name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    field_key: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: true,
    },
    data_type: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: KycDataType.TEXT
    },
    member_field: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    require_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    check_data_type_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enabled_flg: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    group_name: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
  }, {
      underscored: true,
      timestamps: true,
    });

  Model.associate = (models) => {
    Model.belongsTo(models.kycs, {
      as: 'Kyc',
      foreignKey: 'kyc_id',
      targetKey: 'id'
    });
  };

  return Model;
};
