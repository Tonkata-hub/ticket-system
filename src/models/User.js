import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'client',
    },
    failed_login_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    locked_until: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    last_failed_login: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'users',
    timestamps: false, // You can set this true if you want Sequelize to manage `createdAt/updatedAt`
});

export default User;