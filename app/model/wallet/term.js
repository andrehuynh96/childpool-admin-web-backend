module.exports = (sequelize, DataTypes) => {
    const Term = sequelize.define("terms", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
        },
        applied_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        term_no: {
            type: DataTypes.STRING(8),
            allowNull: false
        },
        is_published: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        language: {
            type: DataTypes.STRING(100),
            allowNull: false,
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