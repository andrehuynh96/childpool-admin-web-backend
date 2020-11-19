const Status = require("./value-object/survey-result-status");

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define("survey_results", {
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
      allowNull: false,
      defaultValue: DataTypes.UUIDV4(),
    },
    status: {
      type: DataTypes.STRING(256),
      allowNull: false,
      defaultValue: Status.NEW
    },
    total_answer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_correct: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  return Model;
};
