import { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@lib/cn";
import Button from "@components/ui/Button";
import { ModalIcons } from "@constants/icons";
import "./Modal.css";

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.16 } },
  exit: { opacity: 0, transition: { duration: 0.14 } },
};

const modalVariants = {
  initial: { opacity: 0, y: 14, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.99,
    transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
  },
};

function Modal({
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

  const requestClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && closeOnEscape) requestClose();
    },
    [closeOnEscape, requestClose],
  );

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget && closeOnOverlay) requestClose();
    },
    [closeOnOverlay, requestClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    lastActiveRef.current = document.activeElement;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Only focus once on mount/open
    const timer = setTimeout(() => {
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
        return;
      }
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (firstFocusable) firstFocusable.focus();
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      const el = lastActiveRef.current;
      if (el && typeof el.focus === "function") el.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only run when isOpen specifically changes

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
          onClick={handleOverlayClick}
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

function ModalHeader({ children, className }) {
  return <div className={cn("ds-modal__header", className)}>{children}</div>;
}

function ModalTitle({ children, className, id }) {
  return (
    <h2 id={id} className={cn("ds-modal__title", className)}>
      {children}
    </h2>
  );
}

function ModalDescription({ children, className, id }) {
  return (
    <p id={id} className={cn("ds-modal__description", className)}>
      {children}
    </p>
  );
}

function ModalBody({ children, className }) {
  return <div className={cn("ds-modal__body", className)}>{children}</div>;
}

function ModalFooter({ children, className }) {
  return <div className={cn("ds-modal__footer", className)}>{children}</div>;
}

/**
 * ConfirmModal - No loading spinner inside modal!
 * Modal closes instantly, action runs with notify.promise toast
 */
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "confirm",
}) {
  const iconConfig = ModalIcons[variant] || ModalIcons.confirm;
  const IconComponent = iconConfig.icon;
  const titleId = "ds-confirm-title";
  const descId = "ds-confirm-desc";

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case "delete":
      case "logout":
      case "error":
      case "power":
        return "danger";
      case "warning":
        return "warning";
      case "success":
        return "success";
      default:
        return "primary";
    }
  };

  // Handle confirm - close modal instantly, no loading inside modal
  const handleConfirm = useCallback(() => {
    onClose(); // Close modal immediately
    if (onConfirm) onConfirm();
  }, [onClose, onConfirm]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton
      labelledBy={titleId}
      describedBy={descId}
    >
      <div className="ds-confirm-modal">
        <div
          className="ds-confirm-modal__icon"
          style={{
            backgroundColor: `color-mix(in srgb, ${iconConfig.color} 12%, var(--bg-elevated))`,
          }}
        >
          <IconComponent size={28} style={{ color: iconConfig.color }} />
        </div>

        <ModalHeader className="ds-confirm-modal__header">
          <ModalTitle id={titleId} className="ds-confirm-modal__title">
            {title}
          </ModalTitle>
          <ModalDescription
            id={descId}
            className="ds-confirm-modal__description"
          >
            {description}
          </ModalDescription>
        </ModalHeader>

        <ModalFooter className="ds-confirm-modal__footer">
          <div className="ds-confirm-modal__actions">
            <Button variant="secondary" onClick={onClose} fullWidth>
              {cancelText}
            </Button>
            <Button
              variant={getConfirmButtonVariant()}
              onClick={handleConfirm}
              fullWidth
            >
              {confirmText}
            </Button>
          </div>
        </ModalFooter>
      </div>
    </Modal>
  );
}

function AlertModal({
  isOpen,
  onClose,
  title = "Alert",
  description,
  variant = "info",
  buttonText = "OK",
}) {
  const iconConfig = ModalIcons[variant] || ModalIcons.info;
  const IconComponent = iconConfig.icon;
  const titleId = "ds-alert-title";
  const descId = "ds-alert-desc";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton
      labelledBy={titleId}
      describedBy={descId}
    >
      <div className="ds-confirm-modal">
        <div
          className="ds-confirm-modal__icon"
          style={{
            backgroundColor: `color-mix(in srgb, ${iconConfig.color} 12%, var(--bg-elevated))`,
          }}
        >
          <IconComponent size={28} style={{ color: iconConfig.color }} />
        </div>

        <ModalHeader className="ds-confirm-modal__header">
          <ModalTitle id={titleId} className="ds-confirm-modal__title">
            {title}
          </ModalTitle>
          <ModalDescription
            id={descId}
            className="ds-confirm-modal__description"
          >
            {description}
          </ModalDescription>
        </ModalHeader>

        <ModalFooter className="ds-confirm-modal__footer ds-confirm-modal__footer--single">
          <div className="ds-confirm-modal__actions ds-confirm-modal__actions--single">
            <Button variant="primary" onClick={onClose} fullWidth>
              {buttonText}
            </Button>
          </div>
        </ModalFooter>
      </div>
    </Modal>
  );
}

export default Modal;
export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ConfirmModal,
  AlertModal,
};
