import { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@lib/cn";
import "./Modal.css";

const overlayVariants = {
  initial: { opacity: 0, backdropFilter: "blur(0px)" },
  animate: { opacity: 1, backdropFilter: "blur(4px)", transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.25, ease: "easeIn" } },
};

const modalVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
      opacity: { duration: 0.25 }
    },
  },
  exit: {
    opacity: 0,
    y: 15,
    scale: 0.97,
    transition: { 
      duration: 0.3, 
      ease: [0.16, 1, 0.3, 1],
      opacity: { duration: 0.2 }
    },
  },
};

export function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  className,
  labelledBy,
  describedBy,
}) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastActiveRef = useRef(null);

  const requestClose = useCallback(() => onClose(), [onClose]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && closeOnEscape) requestClose();
    },
    [closeOnEscape, requestClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    lastActiveRef.current = document.activeElement;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      (
        closeBtnRef.current ||
        modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
      )?.focus();
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (typeof lastActiveRef.current?.focus === "function")
        lastActiveRef.current.focus();
    };
  }, [isOpen, handleKeyDown]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="ds-modal-overlay"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={(e) =>
            e.target === e.currentTarget && closeOnOverlay && requestClose()
          }
        >
          <motion.div
            ref={modalRef}
            className={cn("ds-modal", `ds-modal--${size}`, className)}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
          >
            {showCloseButton && (
              <button
                ref={closeBtnRef}
                type="button"
                className="ds-modal__close"
                onClick={requestClose}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export const ModalHeader = ({ children, className }) => (
  <div className={cn("ds-modal__header", className)}>{children}</div>
);
export const ModalTitle = ({ children, className, id }) => (
  <h2 id={id} className={cn("ds-modal__title", className)}>
    {children}
  </h2>
);
export const ModalDescription = ({ children, className, id }) => (
  <p id={id} className={cn("ds-modal__description", className)}>
    {children}
  </p>
);
export const ModalBody = ({ children, className }) => (
  <div className={cn("ds-modal__body", className)}>{children}</div>
);
export const ModalFooter = ({ children, className }) => (
  <div className={cn("ds-modal__footer", className)}>{children}</div>
);

export { ConfirmModal, AlertModal } from "./components/SpecialModals";
export default Modal;
