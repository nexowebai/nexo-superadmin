import { duration, ease } from "./tokens";

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

export const staggerFast = {
  animate: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

export const staggerSlow = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: duration.slow, ease: ease.easeOut },
};

export const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: duration.slow, ease: ease.easeOut },
};

export const rotate = {
  collapsed: { rotate: 0 },
  expanded: { rotate: 180 },
  transition: { duration: duration.normal, ease: ease.easeOut },
};

export const createStagger = (delay = 0.05) => ({
  animate: { transition: { staggerChildren: delay } },
});

export const createFadeInUp = (y = 16, delay = 0) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: y / 2 },
  transition: { duration: duration.slow, ease: ease.easeOut, delay },
});
