import { useCallback } from "react";
import Button from "@components/ui/Button";
import { ModalIcons } from "@constants/icons";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "../Modal";

export function ConfirmModal({
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

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case "delete":
      case "logout":
      case "error":
      case "power": return "danger";
      case "warning": return "warning";
      case "success": return "success";
      default: return "primary";
    }
  };

  const handleConfirm = useCallback(() => {
    onClose();
    if (onConfirm) onConfirm();
  }, [onClose, onConfirm]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton labelledBy="ds-confirm-title" describedBy="ds-confirm-desc">
      <div className="ds-confirm-modal">
        <div className="ds-confirm-modal__icon" style={{ backgroundColor: `color-mix(in srgb, ${iconConfig.color} 12%, var(--bg-elevated))` }}>
          <IconComponent size={28} style={{ color: iconConfig.color }} />
        </div>
        <ModalHeader className="ds-confirm-modal__header">
          <ModalTitle id="ds-confirm-title" className="ds-confirm-modal__title">{title}</ModalTitle>
          <ModalDescription id="ds-confirm-desc" className="ds-confirm-modal__description">{description}</ModalDescription>
        </ModalHeader>
        <ModalFooter className="ds-confirm-modal__footer">
          <div className="ds-confirm-modal__actions">
            <Button variant="secondary" onClick={onClose} fullWidth>{cancelText}</Button>
            <Button variant={getConfirmButtonVariant()} onClick={handleConfirm} fullWidth>{confirmText}</Button>
          </div>
        </ModalFooter>
      </div>
    </Modal>
  );
}

export function AlertModal({
  isOpen,
  onClose,
  title = "Alert",
  description,
  variant = "info",
  buttonText = "OK",
}) {
  const iconConfig = ModalIcons[variant] || ModalIcons.info;
  const IconComponent = iconConfig.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton labelledBy="ds-alert-title" describedBy="ds-alert-desc">
      <div className="ds-confirm-modal">
        <div className="ds-confirm-modal__icon" style={{ backgroundColor: `color-mix(in srgb, ${iconConfig.color} 12%, var(--bg-elevated))` }}>
          <IconComponent size={28} style={{ color: iconConfig.color }} />
        </div>
        <ModalHeader className="ds-confirm-modal__header">
          <ModalTitle id="ds-alert-title" className="ds-confirm-modal__title">{title}</ModalTitle>
          <ModalDescription id="ds-alert-desc" className="ds-confirm-modal__description">{description}</ModalDescription>
        </ModalHeader>
        <ModalFooter className="ds-confirm-modal__footer ds-confirm-modal__footer--single">
          <div className="ds-confirm-modal__actions ds-confirm-modal__actions--single">
            <Button variant="primary" onClick={onClose} fullWidth>{buttonText}</Button>
          </div>
        </ModalFooter>
      </div>
    </Modal>
  );
}
