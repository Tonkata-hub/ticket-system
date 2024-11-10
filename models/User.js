import { DataTypes } from 'sequelize';
import sequelize from '@/config/db';

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'Users',
    timestamps: false, // Disable timestamps to avoid Sequelize expecting createdAt and updatedAt
});

export default User;