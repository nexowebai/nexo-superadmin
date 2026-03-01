import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import notify from '@utils/notify';
import { useDisableOrganization, useResetOrgPassword } from '../../hooks/';

function InputModal({ isOpen, onClose, title, description, children, onSubmit, submitText, submitVariant = 'primary' }) {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="custom-modal-overlay" onClick={onClose}>
            <motion.div
                className="custom-modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
            >
                <div className="custom-modal__header">
                    <h3>{title}</h3>
                    <button className="custom-modal__close" onClick={onClose} type="button">
                        <X size={20} />
                    </button>
                </div>
                {description && <p className="custom-modal__desc">{description}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="custom-modal__body">
                        {children}
                    </div>
                    <div className="custom-modal__footer">
                        <button type="button" className="custom-modal__btn custom-modal__btn--secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={`custom-modal__btn custom-modal__btn--${submitVariant}`}>
                            {submitText}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export function DisableOrgModal({ isOpen, onClose, orgId, orgName, onSuccess }) {
    const [reason, setReason] = useState('');
    const { mutate: disableOrg } = useDisableOrganization();

    const handleDisable = useCallback(() => {
        if (!reason.trim()) {
            notify.error('Please provide a reason');
            return;
        }

        onClose();

        notify.promise(
            new Promise((resolve, reject) => {
                disableOrg({ id: orgId, reason }, {
                    onSuccess: () => {
                        setReason('');
                        if (onSuccess) onSuccess();
                        resolve();
                    },
                    onError: reject
                });
            }),
            {
                loading: 'Disabling organization...',
                success: 'Organization disabled successfully!',
                error: 'Failed to disable organization'
            }
        );
    }, [orgId, reason, disableOrg, onClose, onSuccess]);

    return (
        <InputModal
            isOpen={isOpen}
            onClose={() => { onClose(); setReason(''); }}
            title="Disable Organization"
            description={`This will prevent all users of "${orgName}" from accessing the platform. Please provide a reason.`}
            onSubmit={handleDisable}
            submitText="Disable Organization"
            submitVariant="warning"
        >
            <div className="custom-modal__field">
                <label>Reason for disabling</label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for disabling..."
                    rows={3}
                    autoFocus
                />
            </div>
        </InputModal>
    );
}

export function ResetPasswordModal({ isOpen, onClose, orgId, onSuccess }) {
    const [password, setPassword] = useState('');
    const { mutate: resetPassword } = useResetOrgPassword();

    const handleReset = useCallback(() => {
        if (!password || password.length < 8) {
            notify.error('Password must be at least 8 characters');
            return;
        }

        onClose();

        notify.promise(
            new Promise((resolve, reject) => {
                resetPassword({ id: orgId, password }, {
                    onSuccess: () => {
                        setPassword('');
                        if (onSuccess) onSuccess();
                        resolve();
                    },
                    onError: reject
                });
            }),
            {
                loading: 'Resetting password...',
                success: 'Password reset successfully!',
                error: 'Failed to reset password'
            }
        );
    }, [orgId, password, resetPassword, onClose, onSuccess]);

    return (
        <InputModal
            isOpen={isOpen}
            onClose={() => { onClose(); setPassword(''); }}
            title="Reset Admin Password"
            description="Enter a new password for the organization administrator."
            onSubmit={handleReset}
            submitText="Reset Password"
            submitVariant="warning"
        >
            <div className="custom-modal__field">
                <label>New Password</label>
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoFocus
                    autoComplete="off"
                />
            </div>
        </InputModal>
    );
}
