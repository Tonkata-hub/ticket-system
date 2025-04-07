const { DataTypes } = require("sequelize")
const sequelize = require("@/lib/db")

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    issue_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    current_condition: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    priority: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status_badge: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    selected_event: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client_note: {
        type: DataTypes.TEXT,
        allowNull: true, // Changed from false to true to make it optional
    },
    date_of_starting_work: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    assignee: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    current_condition_admin: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    problem_solved_at: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    action_taken: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    time_taken_to_solve: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    related_tickets: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    attachments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'tickets',
    timestamps: false,
});

module.exports = Ticket

