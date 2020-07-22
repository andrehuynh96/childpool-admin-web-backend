module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("email_templates", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    subject:{
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    template: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING(100),
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
 
  return Model;
}   