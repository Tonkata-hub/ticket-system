import { DataTypes } from 'sequelize';
import sequelize from '@/config/db';

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    issue_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issue_description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state_description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM('urgent', 'priority', 'standard', 'low-priority'),
        allowNull: false,
    },
    event: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('open', 'in-progress', 'closed'),
        allowNull: false,
        defaultValue: 'open',
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
}, {
    tableName: 'Tickets',
    timestamps: false,
});

export default Ticket;