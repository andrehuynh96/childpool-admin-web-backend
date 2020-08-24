module.exports = (sequelize, DataTypes) => {
  const Term = sequelize.define("terms", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    term_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    ja_content: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    applied_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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

  return Term;
};
