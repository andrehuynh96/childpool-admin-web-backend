
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('member_kyc_properties', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    member_kyc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    property_id: {
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
    value: {
      type: DataTypes.TEXT('medium'),
      allowNull: false,
    },
  }, {
      underscored: true,
      timestamps: true,
    });


  Model.associate = (models) => {
    Model.belongsTo(models.member_kycs, {
      as: 'MemberKyc',
      foreignKey: 'member_kyc_id',
      targetKey: 'id'
    });
    Model.belongsTo(models.kyc_properties, {
      as: 'KycProperty',
      foreignKey: 'property_id',
      targetKey: 'id'
    });
  };

  return Model;
};
