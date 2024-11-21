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
    queryType: {
        type: DataTypes.ENUM('PC компютри, компоненти и мобилни у-ва', 'Сървъри и вирт. машини, достъп до папки', 'Принтиране Копиране Сканиране', 'Мрежи и Мрежово оборудване, VPN', 'Сигурност и Сертифициране, GDPR', 'Windows, OS, Users, Share, база данни', 'Приложения, Счетоводен софтуер', 'Офис приложения, ms365', 'Електронни подписи и сертификати', 'Хостинг, сайт, имейли, акаунти', 'Др.'),
        allowNull: false,
        comment: 'Избор на запитване',
    },
    queryDesc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Описание на запитването',
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID на съставителя',
    },
    status: {
        type: DataTypes.ENUM('Не работи: спря устройство, услуга', 'За преглед hardware, [или фабрични настройки]', 'За преглед software, [или преинсталация]', 'Работи бавно, забива, дава грешки', 'Промяна на у-во, потребител, приложение', 'За смяна на консуматив', 'Проект (изисква обсъждане)', 'Др.'),
        allowNull: false,
        comment: 'Състояние',
    },
    priority: {
        type: DataTypes.ENUM('Спешен', 'Стандартен', 'Нисък приоритет'),
        allowNull: false,
        comment: 'Priority',
    },
    statusDesc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Описание на състоянието',
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
        type: DataTypes.ENUM('Не работи: спря устройство, услуга', 'За преглед hardware, [или фабрични настройки]', 'За преглед software, [или преинсталация]', 'Работи бавно, забива, дава грешки', 'Промяна на у-во, потребител, приложение', 'За смяна на консуматив', 'Проект (изисква обсъждане)', 'Др.'),
        allowNull: true,
        comment: 'Състояние - статус от администратора',
    },
    supportType: {
        type: DataTypes.ENUM('Място', 'Дистанционно'),
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
    timestamps: false,
});

export default Ticket;