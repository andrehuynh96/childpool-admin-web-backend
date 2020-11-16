const QuestionType = require("./value-object/question-type");
const QuestionCategory = require("./value-object/question-category");
const QuestionSubType = require('./value-object/question-sub-type');

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define("questions", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    title_ja: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    question_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: QuestionCategory.ANSWER_NOW,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    estimate_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    forecast_key: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    actived_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true,
    },
    deleted_flg: {
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
    survey_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sub_type: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: QuestionSubType.QUESTIONNAIRE
    }
  }, {
    underscored: true,
    timestamps: true,
  });

  Question.associate = (models) => {
    Question.hasMany(models.question_answers, {
      as: "Answers",
      foreignKey: 'question_id',
    });
  };

  return Question;
};
