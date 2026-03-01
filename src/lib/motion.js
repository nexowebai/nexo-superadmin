/*
 * Framer Motion Presets Library
 * Centralized animation configurations for consistent UX
 */

export const duration = {
    instant: 0.1,
    fast: 0.15,
    normal: 0.2,
    slow: 0.3,
    slower: 0.5,
};

export const ease = {
    linear: [0, 0, 1, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: [0.175, 0.885, 0.32, 1.275],
    bounce: [0.68, -0.55, 0.265, 1.55],
    smooth: [0.25, 0.1, 0.25, 1],
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration.normal, ease: ease.easeOut },
};

export const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
    transition: { duration: duration.slow, ease: ease.easeOut },
};

export const fadeInDown = {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: duration.slow, ease: ease.easeOut },
};

export const fadeInLeft = {
    initial: { opacity: 0, x: -16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -8 },
    transition: { duration: duration.slow, ease: ease.easeOut },
};

export const fadeInRight = {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 8 },
    transition: { duration: duration.slow, ease: ease.easeOut },
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: duration.normal, ease: ease.spring },
};

export const slideInFromLeft = {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: { duration: duration.slow, ease: ease.easeOut },
};

export const slideInFromRight = {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { duration: duration.slow, ease: ease.easeOut },
};

export const modalOverlay = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration.fast },
};

export const modalContent = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: { duration: duration.slow, ease: ease.spring },
};

export const dropdown = {
    initial: { opacity: 0, scale: 0.95, y: -8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -8 },
    transition: { duration: duration.fast, ease: ease.easeOut },
};

export const tooltip = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: duration.instant },
};

export const sidebarItem = {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -12 },
    transition: { duration: duration.normal, ease: ease.easeOut },
};

export const listItem = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

export const staggerFast = {
    animate: {
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0.05,
        },
    },
};

export const staggerSlow = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.15,
        },
    },
};

export const cardHover = {
    rest: {
        scale: 1,
        y: 0,
        transition: { duration: duration.normal, ease: ease.easeOut },
    },
    hover: {
        scale: 1.02,
        y: -2,
        transition: { duration: duration.fast, ease: ease.easeOut },
    },
};

export const buttonPush = {
    rest: { scale: 1 },
    pressed: { scale: 0.97 },
    transition: { duration: duration.instant },
};

export const pageTransition = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: duration.slow, ease: ease.easeOut },
};

export const collapse = {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: duration.slow, ease: ease.easeOut },
};

export const rotate = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 },
    transition: { duration: duration.normal, ease: ease.easeOut },
};

export const shimmer = {
    animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
            duration: 1.5,
            ease: 'linear',
            repeat: Infinity,
        },
    },
};

export const pulse = {
    animate: {
        opacity: [1, 0.5, 1],
        transition: {
            duration: 1.5,
            ease: 'linear',
            repeat: Infinity,
        },
    },
};

export const spring = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};

export const springBouncy = {
    type: 'spring',
    stiffness: 300,
    damping: 20,
};

export const springGentle = {
    type: 'spring',
    stiffness: 200,
    damping: 25,
};

export const createStagger = (delay = 0.05) => ({
    animate: {
        transition: {
            staggerChildren: delay,
        },
    },
});

export const createFadeInUp = (y = 16, delay = 0) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: y / 2 },
    transition: { duration: duration.slow, ease: ease.easeOut, delay },
});
