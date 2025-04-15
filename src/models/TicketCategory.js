const { DataTypes } = require("sequelize");
const sequelize = require("@/lib/db");

const TicketCategory = sequelize.define("TicketCategory", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "ticket_categories",
    timestamps: false,
});

module.exports = TicketCategory;
