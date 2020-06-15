const ClaimRequestStatus = require("./value-object/claim-request-status");

module.exports = (sequelize, DataTypes) => {
    const ClaimRequest = sequelize.define("claim_requests", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        member_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        member_account_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ClaimRequestStatus.Pending
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        currency_symbol: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        account_number: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        bank_name: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        branch_name: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        account_holder: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        wallet_address: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        txid: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
    }, {
        underscored: true,
        timestamps: true,
    });

    return ClaimRequest;
}