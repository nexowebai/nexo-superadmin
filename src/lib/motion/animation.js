export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: { duration: 1.5, ease: "linear", repeat: Infinity },
  },
};

export const pulse = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: { duration: 1.5, ease: "linear", repeat: Infinity },
  },
};

export const spring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const springBouncy = {
  type: "spring",
  stiffness: 300,
  damping: 20,
};

export const springGentle = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};
