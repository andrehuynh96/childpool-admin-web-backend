module.exports = (sequelize, DataTypes) => {
  const QuestionAnswer = sequelize.define("question_answers", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    text_ja: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    is_correct_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false,
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  return QuestionAnswer;
};
