module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("kycs", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    key: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prev_level: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    have_to_pass_prev_level_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    auto_approve_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    first_level_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
      underscored: true,
      timestamps: true,
    });

  Model.associate = (models) => {
    Model.hasMany(models.kyc_properties, { foreignKey: 'kyc_id' });
  };
  return Model;
} 