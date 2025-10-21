export const locales = ["en", "bg"];

export function getFallbackLocale() {
    return "bg";
}

export function getDictionary(locale) {
    switch (locale) {
        case "bg":
            return bg;
        case "en":
        default:
            return en;
    }
}

export const en = {
    common: {
        appName: "Support Ticket System",
        home: "Home",
        login: "Log in",
        logout: "Log out",
        myTickets: "My tickets",
        admin: "Admin",
        management: "Management",
        accountMenu: "Account menu",
        accountType: "Account type:",
        administrator: "Administrator",
        client: "Client",
        language: "Language",
        english: "English",
        bulgarian: "Bulgarian",
    },
    login: {
        title: "Log in",
        subtitle: "Enter your credentials to access the ticket system",
        email: "Email address",
        password: "Password",
        forgotPassword: "Forgot password?",
        noAccount: "Don't have an account?",
        register: "Register",
        submit: "Log in",
    },
    register: {
        title: "Create Account",
        subtitle: "Sign up to get started",
        name: "Full Name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        submit: "Create Account",
        hasAccount: "Already have an account?",
        login: "Log in",
    },
    home: {
        submitNewTicket: "Submit a new support ticket",
        submitTicket: "Submit a support ticket",
        helpText: "Need help? Fill out the form below and our support team will get back to you as soon as possible.",
        cardTitle: "New support ticket",
        cardDescription: "Please provide details about your issue",
        pleaseLogin: "Please log in to submit a ticket!",
        loginCta: "Log in",
        shortDescription: "Short description",
        shortDescriptionPlaceholder: "Enter a short description of the issue",
        priority: "Priority",
        select: "Select {label}",
        pleaseSpecify: "Please specify {label}",
        issueType: "Request type",
        condition: "Condition",
        event: "Event",
        submitting: "Submitting...",
        submitTicketCta: "Submit Ticket",
        loadOptionsError: "Failed to load ticket options",
        mustLoginToast: "Please log in to submit a ticket",
        completeRequiredToast: "Please complete all required fields",
        createdSuccess: "Ticket {uid} created successfully!",
        createFailed: "Failed to create ticket: {message}",
    },
    whyUs: {
        title: "Why choose our ticket system?",
        features: {
            easy: {
                title: "Easy ticket submission",
                description: "Create and submit tickets quickly and easily with our user-friendly interface.",
            },
            fast: {
                title: "Fast response time",
                description: "Our support team provides quick responses to all submitted tickets.",
            },
            security: {
                title: "Security and privacy",
                description: "Your data is protected with state-of-the-art security and encryption.",
            },
            priority: {
                title: "Priority processing",
                description: "Tickets are processed by priority levels, ensuring fast resolution of critical issues.",
            },
            personalized: {
                title: "Personalized solutions",
                description: "An individual approach to each client to ensure optimal results and satisfaction.",
            },
            tracking: {
                title: "Issue tracking",
                description: "Track the status of your tickets in real time with our tracking system.",
            },
        },
    },
    howItWorks: {
        title: "How it works",
        steps: {
            one: {
                title: "Submit a ticket",
                description: "Fill out the ticket form with details about your issue or inquiry.",
            },
            two: {
                title: "Receive confirmation",
                description: "Receive instant confirmation with your ticket number for reference.",
            },
            three: {
                title: "Expect assistance",
                description: "Our team reviews your ticket and provides timely help to resolve the issue.",
            },
        },
    },
    tickets: {
        dashboardTitle: "Tickets Dashboard",
        tableView: "Table View",
        cardView: "Card View",
        searchPlaceholder: "Search tickets...",
        sortBy: "Sort by",
        sortOptions: {
            updatedAt: "Last updated",
            createdAt: "Date created",
            selectedEvent: "Event name",
        },
        statuses: "Statuses",
        priorities: "Priorities",
        creators: "Creators",
        resetFilters: "Reset Filters",
        allWithLabel: "All {label}",
        clearAll: "Clear all",
    },
};

export const bg = {
    common: {
        appName: "Система за билети",
        home: "Начало",
        login: "Вход",
        logout: "Изход",
        myTickets: "Моите билети",
        admin: "Админ",
        management: "Управление",
        accountMenu: "Профилно меню",
        accountType: "Тип акаунт:",
        administrator: "Администратор",
        client: "Клиент",
        language: "Език",
        english: "Английски",
        bulgarian: "Български",
    },
    login: {
        title: "Вход в системата",
        subtitle: "Въведете вашите данни за достъп до системата за билети",
        email: "Имейл адрес",
        password: "Парола",
        forgotPassword: "Забравена парола?",
        noAccount: "Нямате акаунт?",
        register: "Регистрирайте се",
        submit: "Вход",
    },
    register: {
        title: "Създай акаунт",
        subtitle: "Създайте акаунт, за да започнете",
        name: "Пълно име",
        email: "Имейл адрес",
        password: "Парола",
        confirmPassword: "Потвърдете паролата",
        submit: "Създай акаунт",
        hasAccount: "Вече имате акаунт?",
        login: "Вход",
    },
    home: {
        submitNewTicket: "Изпратете нов билет за поддръжка",
        submitTicket: "Изпратете билет за поддръжка",
        helpText:
            "Нуждаете се от помощ? Попълнете формуляра по-долу и нашият екип за поддръжка ще се свърже с вас възможно най-скоро.",
        cardTitle: "Нов билет за поддръжка",
        cardDescription: "Моля, предоставете подробности за вашия проблем",
        pleaseLogin: "Моля, влезте в системата, за да изпратите билет!",
        loginCta: "Вход в системата",
        shortDescription: "Кратко описание",
        shortDescriptionPlaceholder: "Въведете кратко описание на проблема",
        priority: "Приоритет",
        select: "Изберете {label}",
        pleaseSpecify: "Моля, уточнете {label}",
        issueType: "Избор на запитване",
        condition: "Състояние",
        event: "Действие",
        submitting: "Изпращане...",
        submitTicketCta: "Изпрати билет",
        loadOptionsError: "Неуспешно зареждане на опциите за билет",
        mustLoginToast: "Please log in to submit a ticket",
        completeRequiredToast: "Please complete all required fields",
        createdSuccess: "Ticket {uid} created successfully!",
        createFailed: "Failed to create ticket: {message}",
    },
    whyUs: {
        title: "Защо да изберете нашата система за билети?",
        features: {
            easy: {
                title: "Лесно подаване на билети",
                description:
                    "Създавайте и подавайте билети за поддръжка бързо и лесно с нашия потребителски интерфейс.",
            },
            fast: {
                title: "Бързо време за отговор",
                description: "Нашият екип за поддръжка осигурява бързи отговори на всички подадени билети.",
            },
            security: {
                title: "Сигурност и конфиденциалност",
                description: "Вашите данни са защитени с най-модерни мерки за сигурност и криптиране.",
            },
            priority: {
                title: "Приоритетна обработка",
                description:
                    "Билетите се обработват по приоритетни нива, осигурявайки бързо решение на критични проблеми.",
            },
            personalized: {
                title: "Персонализирани решения",
                description:
                    "Индивидуален подход към всеки клиент, за да гарантираме оптимални резултати и удовлетворение.",
            },
            tracking: {
                title: "Проследяване на проблемите",
                description: "Проследявайте статуса на вашите билети в реално време с нашата система за проследяване.",
            },
        },
    },
    howItWorks: {
        title: "Как работи",
        steps: {
            one: {
                title: "Подайте билет",
                description: "Попълнете формуляра за билет с подробности за вашия проблем или запитване.",
            },
            two: {
                title: "Получете потвърждение",
                description: "Получете незабавно потвърждение с номера на вашия билет за справка.",
            },
            three: {
                title: "Очаквайте съдействие",
                description:
                    "Нашият екип преглежда вашия билет и осигурява навременна помощ за разрешаване на проблема.",
            },
        },
    },
    tickets: {
        dashboardTitle: "Табло с билети",
        tableView: "Табличен изглед",
        cardView: "Изглед с карти",
        searchPlaceholder: "Търсене в билетите...",
        sortBy: "Сортиране по",
        sortOptions: {
            updatedAt: "Последно обновени",
            createdAt: "Дата на създаване",
            selectedEvent: "Име на събитие",
        },
        statuses: "Статуси",
        priorities: "Приоритети",
        creators: "Създатели",
        resetFilters: "Махни филтрите",
        allWithLabel: "Всички {label}",
        clearAll: "Изчисти всички",
    },
};
