const SurveyStatus = require('./value-object/survey-status');
const SurveyType = require('./value-object/survey-type');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("quizzes", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    name_ja: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: SurveyStatus.DRAFT
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: SurveyType.SURVEY
    },
    silver_membership_point: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gold_membership_point: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    platinum_membership_point: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deleted_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    }
  },{
    underscored: true,
    timestamps: true,
  });

  Model.associate = function (models) {
    Model.hasMany(models.questions, { foreignKey: 'survey_id', sourceKey: 'id' });
  };

  return Model;
};
