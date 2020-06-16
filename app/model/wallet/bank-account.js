module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('bank_accounts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bank_name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    branch_name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    account_name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    account_number: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    actived_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      default: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {
      underscored: true,
      timestamps: true,
    });

  return Model;
};