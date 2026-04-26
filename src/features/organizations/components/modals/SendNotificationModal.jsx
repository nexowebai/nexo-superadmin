import { useState } from "react";
import { Bell, Send } from "lucide-react";
import notify from "@utils/notify";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Button,
  Select,
} from "@components/ui";

export function SendNotificationModal({ isOpen, onClose, orgName }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !message.trim()) {
      notify.error("Please fill all required fields");
      return;
    }
    notify.success(`High-speed notification delivered to ${orgName}`);
    onClose();
    setTitle("");
    setMessage("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
      <form onSubmit={handleSend}>
        <ModalHeader className="modal-form-header">
          <div className="modal-form-header__icon ds-icon-bg--info">
            <Bell size={20} />
          </div>
          <div className="modal-form-header__content">
            <ModalTitle>Dispatch Notification</ModalTitle>
            <ModalDescription>
              Target Audience:{" "}
              <span className="font-bold text-primary">{orgName}</span>
            </ModalDescription>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="form-field-v2">
              <label>Delivery Priority</label>
              <Select
                options={[
                  { label: "Informational", value: "info" },
                  { label: "Urgent Alert", value: "error" },
                  { label: "Service Notice", value: "warning" },
                ]}
                value={type}
                onChange={setType}
              />
            </div>
            <div className="form-field-v2">
              <label>Message Heading</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Protocol Upgrade Notification"
                className="ds-input"
              />
            </div>
          </div>
          <div className="form-field-v2">
            <label>Transmission Content</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Construct your communication here..."
              rows={6}
              className="ds-input"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="modal-form-footer">
            <Button
              variant="secondary"
              onClick={onClose}
              type="button"
              fullWidth
              className="h-12 font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              icon={Send}
              fullWidth
              className="h-12 font-bold"
            >
              Send Notification
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default SendNotificationModal;
