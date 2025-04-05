// This file contains reusable animation variants for consistent animations across components

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
}

export const slideUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.1 } },
}

export const slideIn = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.1 } },
}

export const scale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } },
}

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.02,
            duration: 0.1,
        },
    },
}

export const buttonHover = {
    hover: { scale: 1.05, transition: { duration: 0.1 } },
    tap: { scale: 0.95, transition: { duration: 0.05 } },
}

export const rotate = {
    hover: { rotate: 90, transition: { duration: 0.15 } },
    tap: { scale: 0.9, transition: { duration: 0.05 } },
}

// Fast search result animations
export const searchResults = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.15, staggerChildren: 0.01 },
        },
    },
    item: {
        hidden: { opacity: 0, y: 5 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.15 },
        },
        exit: {
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.1 },
        },
    },
}

