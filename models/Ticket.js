import { DataTypes } from 'sequelize';
import sequelize from '@/config/db';

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Дата на съставяне',
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Съставител',
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID на съставителя',
    },
    queryType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Избор на запитване',
    },
    queryDesc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Описание на запитването',
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Състояние',
    },
    statusDesc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Описание на състоянието',
    },
    priority: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Приоритет',
    },
    category: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Категория',
    },
    signOff: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Sign off',
    },
    actionStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Дата на започване на действие (адм.)',
    },
    admin: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Кой администратор',
    },
    dispatcher: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Диспечер (ако е разпределил задачата)',
    },
    adminStatus: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Състояние - статус от администратора',
    },
    supportType: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Как съдейства за проблема',
    },
    actionPerformed: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Действие - Какво е извършено?',
    },
    timeSpent: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Колко време? (цифри)',
    },
    steps: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Конкретни стъпки',
    },
    ghost: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Ghost - няма връзка',
    },
}, {
    tableName: 'Tickets',
    timestamps: false, // Disable Sequelize's automatic timestamps
});

export default Ticket;
