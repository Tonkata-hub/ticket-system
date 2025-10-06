const { DataTypes } = require("sequelize");
const sequelize = require("@/lib/db");

const TicketCategory = sequelize.define("TicketCategory", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    label: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: "ticket_categories",
    timestamps: false,
});

module.exports = TicketCategory;
