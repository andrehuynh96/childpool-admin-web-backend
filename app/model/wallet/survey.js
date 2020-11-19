const SurveyStatus = require('./value-object/survey-status');
const SurveyType = require('./value-object/survey-type');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("surveys", {
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
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    content_ja: {
      type: DataTypes.TEXT('long'),
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
    actived_flg: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
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
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    membership_point: {
      type: DataTypes.JSON,
      allowNull: true
    },
    estimate_time: {
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
