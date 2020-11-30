module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("survey_answers", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    survey_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    value: {
      type: DataTypes.TEXT('medium'),
      allowNull: true,
    },
    is_correct_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    }
  }, {
    underscored: true,
    timestamps: true,
  });

  return Model;
};
