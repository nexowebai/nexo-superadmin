import { duration, ease } from "./tokens";

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

export const cardHover = {
  rest: { scale: 1, y: 0, transition: { duration: duration.normal, ease: ease.easeOut } },
  hover: { scale: 1.02, y: -2, transition: { duration: duration.fast, ease: ease.easeOut } },
};

export const buttonPush = {
  rest: { scale: 1 },
  pressed: { scale: 0.97 },
  transition: { duration: duration.instant },
};
