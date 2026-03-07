import { useState, useCallback } from 'react';
import { ShieldAlert, KeyRound, Bell, Tag, Send, Plus, CreditCard } from 'lucide-react';
import notify from '@utils/notify';
import { useDisableOrganization, useResetOrgPassword } from '../hooks/useOrganizations';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, Button, Select } from '@components/ui';

export function DisableOrgModal({ isOpen, onClose, orgId, orgName, onSuccess }) {
    const [reason, setReason] = useState('');
    const { mutate: disableOrg } = useDisableOrganization();

    const handleDisable = useCallback((e) => {
        if (e) e.preventDefault();
        if (!reason.trim()) {
            notify.error('Please provide a reason');
            return;
        }
        onClose();
        notify.promise(
            new Promise((resolve, reject) => {
                disableOrg({ id: orgId, reason }, {
                    onSuccess: () => { setReason(''); onSuccess?.(); resolve(); },
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
        <Modal isOpen={isOpen} onClose={() => { onClose(); setReason(''); }} size="md" showCloseButton>
            <form onSubmit={handleDisable}>
                <div className="ds-confirm-modal">
                    <div className="ds-confirm-modal__icon" style={{ backgroundColor: 'var(--warning-soft)' }}>
                        <ShieldAlert size={28} className="text-warning" />
                    </div>
                    <ModalHeader className="ds-confirm-modal__header">
                        <ModalTitle className="ds-confirm-modal__title">Disable Organization</ModalTitle>
                        <ModalDescription className="ds-confirm-modal__description">
                            This will prevent all users of "{orgName}" from accessing the platform.
                        </ModalDescription>
                    </ModalHeader>
                    <ModalBody className="pb-6 px-6">
                        <div className="form-field-v2">
                            <label>Reason for disabling</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter reason for disabling..."
                                rows={3}
                                autoFocus
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter className="ds-confirm-modal__footer">
                        <div className="ds-confirm-modal__actions">
                            <Button variant="secondary" onClick={onClose} type="button" fullWidth>Cancel</Button>
                            <Button variant="warning" type="submit" fullWidth>Disable Organization</Button>
                        </div>
                    </ModalFooter>
                </div>
            </form>
        </Modal>
    );
}

export function ManagePlanModal({ isOpen, onClose, orgName, currentPlan, onSuccess }) {
    const [tier, setTier] = useState(currentPlan || 'professional');
    const [maxUsers, setMaxUsers] = useState(100);
    const [maxProjects, setMaxProjects] = useState(20);

    const handleUpdate = (e) => {
        if (e) e.preventDefault();
        notify.success('Subscription plan updated successfully');
        onSuccess?.();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
            <form onSubmit={handleUpdate}>
                <ModalHeader>
                    <div className="modal-form-header">
                        <div className="modal-form-header__icon bg-primary-soft text-primary">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <ModalTitle>Manage Subscription</ModalTitle>
                            <ModalDescription>Editing plan for {orgName}</ModalDescription>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody className="space-y-5">
                    <div className="form-field-v2">
                        <label>Subscription Tier</label>
                        <Select
                            options={[
                                { label: 'Basic Plan', value: 'basic' },
                                { label: 'Professional Plan', value: 'professional' },
                                { label: 'Enterprise Plan', value: 'enterprise' }
                            ]}
                            value={tier}
                            onChange={setTier}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-field-v2">
                            <label>Max Users</label>
                            <input type="number" value={maxUsers} onChange={(e) => setMaxUsers(e.target.value)} />
                        </div>
                        <div className="form-field-v2">
                            <label>Max Projects</label>
                            <input type="number" value={maxProjects} onChange={(e) => setMaxProjects(e.target.value)} />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="modal-form-footer">
                        <Button variant="secondary" onClick={onClose} type="button" fullWidth>Cancel</Button>
                        <Button variant="primary" type="submit" fullWidth>Save Changes</Button>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    );
}

export function ResetPasswordModal({ isOpen, onClose, orgId, onSuccess }) {
    const [password, setPassword] = useState('');
    const { mutate: resetPassword } = useResetOrgPassword();

    const handleReset = useCallback((e) => {
        if (e) e.preventDefault();
        if (!password || password.length < 8) {
            notify.error('Password must be at least 8 characters');
            return;
        }
        onClose();
        notify.promise(
            new Promise((resolve, reject) => {
                resetPassword({ id: orgId, password }, {
                    onSuccess: () => { setPassword(''); onSuccess?.(); resolve(); },
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
        <Modal isOpen={isOpen} onClose={() => { onClose(); setPassword(''); }} size="md" showCloseButton>
            <form onSubmit={handleReset}>
                <div className="ds-confirm-modal">
                    <div className="ds-confirm-modal__icon" style={{ backgroundColor: 'var(--warning-soft)' }}>
                        <KeyRound size={28} className="text-warning" />
                    </div>
                    <ModalHeader className="ds-confirm-modal__header">
                        <ModalTitle className="ds-confirm-modal__title">Reset Admin Password</ModalTitle>
                        <ModalDescription className="ds-confirm-modal__description">
                            Set a new password for the organization administrator.
                        </ModalDescription>
                    </ModalHeader>
                    <ModalBody className="pb-6 px-6">
                        <div className="form-field-v2">
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
                    </ModalBody>
                    <ModalFooter className="ds-confirm-modal__footer">
                        <div className="ds-confirm-modal__actions">
                            <Button variant="secondary" onClick={onClose} type="button" fullWidth>Cancel</Button>
                            <Button variant="warning" type="submit" fullWidth>Reset Password</Button>
                        </div>
                    </ModalFooter>
                </div>
            </form>
        </Modal>
    );
}

export function SendNotificationModal({ isOpen, onClose, orgName }) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');

    const handleSend = (e) => {
        if (e) e.preventDefault();
        if (!title.trim() || !message.trim()) {
            notify.error('Please fill all fields');
            return;
        }
        notify.success(`Notification sent to ${orgName}`);
        onClose();
        setTitle('');
        setMessage('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
            <form onSubmit={handleSend}>
                <ModalHeader>
                    <div className="modal-form-header">
                        <div className="modal-form-header__icon bg-primary-soft text-primary">
                            <Bell size={20} />
                        </div>
                        <div>
                            <ModalTitle>Send Notification</ModalTitle>
                            <ModalDescription>To: {orgName}</ModalDescription>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody className="space-y-4">
                    <div className="form-field-v2">
                        <label>Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. System Maintenance" />
                    </div>
                    <div className="form-field-v2">
                        <label>Message</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Type your message here..." />
                    </div>
                    <div className="form-field-v2">
                        <label>Priority</label>
                        <Select
                            options={[
                                { label: 'Info', value: 'info' },
                                { label: 'Warning', value: 'warning' },
                                { label: 'Critical', value: 'error' }
                            ]}
                            value={type}
                            onChange={setType}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="modal-form-footer">
                        <Button variant="secondary" onClick={onClose} type="button" fullWidth>Cancel</Button>
                        <Button variant="primary" type="submit" icon={Send} fullWidth>Send Now</Button>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    );
}

export function ManageCouponsModal({ isOpen, onClose, orgName }) {
    const [coupons, setCoupons] = useState([
        { id: '1', code: 'WELCOME50', discount: '50%', expiry: '2025-12-31' }
    ]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
            <ModalHeader>
                <div className="modal-form-header">
                    <div className="modal-form-header__icon bg-info-soft text-info">
                        <Tag size={20} />
                    </div>
                    <div>
                        <ModalTitle>Manage Coupons</ModalTitle>
                        <ModalDescription>Active coupons for {orgName}</ModalDescription>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-secondary m-0">Assigned Coupons</h4>
                        <Button variant="primary" size="sm" icon={Plus}>Assign New</Button>
                    </div>
                    <div className="border border-base rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-bg-elevated text-secondary font-bold">
                                <tr>
                                    <th className="p-3 text-left">Code</th>
                                    <th className="p-3 text-left">Discount</th>
                                    <th className="p-3 text-left">Expiry</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted">No coupons assigned</td>
                                    </tr>
                                ) : (
                                    coupons.map(c => (
                                        <tr key={c.id} className="border-t border-base">
                                            <td className="p-3 font-mono font-bold text-primary">{c.code}</td>
                                            <td className="p-3">{c.discount}</td>
                                            <td className="p-3 text-secondary">{c.expiry}</td>
                                            <td className="p-3 text-right">
                                                <button
                                                    className="text-error hover:underline text-xs font-bold"
                                                    onClick={() => setCoupons(prev => prev.filter(x => x.id !== c.id))}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="modal-form-footer modal-form-footer--single">
                    <Button variant="secondary" onClick={onClose} fullWidth>Close</Button>
                </div>
            </ModalFooter>
        </Modal>
    );
}
