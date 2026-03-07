import { useState } from 'react';
import { Rocket, Sparkles } from 'lucide-react';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, Button, Select } from '@components/ui';
import notify from '@utils/notify';

export function PlanModal({ isOpen, onClose, billingCycle, setBillingCycle }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
            <ModalHeader>
                <div className="modal-form-header">
                    <div className="modal-form-header__icon bg-primary-soft text-primary">
                        <Rocket size={20} />
                    </div>
                    <div>
                        <ModalTitle>Create New Plan</ModalTitle>
                        <ModalDescription>Set up a new subscription plan for organizations</ModalDescription>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="space-y-5">
                <div className="form-field-v2">
                    <label>Plan Name</label>
                    <input type="text" placeholder="e.g. Enterprise Plus" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-field-v2">
                        <label>Base Price ($)</label>
                        <input type="number" placeholder="99.00" />
                    </div>
                    <div className="form-field-v2">
                        <label>Billing Cycle</label>
                        <Select
                            options={[
                                { label: 'Monthly', value: 'monthly' },
                                { label: 'Yearly', value: 'yearly' }
                            ]}
                            value={billingCycle}
                            onChange={setBillingCycle}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-field-v2">
                        <label>Max Projects</label>
                        <input type="number" placeholder="20" />
                    </div>
                    <div className="form-field-v2">
                        <label>Extra Cost Per Unit ($)</label>
                        <input type="number" placeholder="5.00" />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="modal-form-footer">
                    <Button variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
                    <Button variant="primary" onClick={() => { notify.success('Plan created'); onClose(); }} fullWidth>Create Plan</Button>
                </div>
            </ModalFooter>
        </Modal>
    );
}

export function CouponModal({ isOpen, onClose, discountType, setDiscountType }) {
    const [code, setCode] = useState('');
    const [amount, setAmount] = useState('');

    const handleCreate = () => {
        if (!code.trim()) {
            notify.error('Please enter a coupon code');
            return;
        }
        notify.success('Coupon created successfully');
        setCode('');
        setAmount('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton>
            <ModalHeader>
                <div className="modal-form-header">
                    <div className="modal-form-header__icon bg-info-soft text-info">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <ModalTitle>Create Coupon</ModalTitle>
                        <ModalDescription>Generate a discount coupon for organizations</ModalDescription>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="space-y-5">
                <div className="form-field-v2">
                    <label>Coupon Code</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SUMMER50"
                        style={{ fontFamily: 'var(--font-mono, monospace)' }}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-field-v2">
                        <label>Discount Type</label>
                        <Select
                            options={[
                                { label: 'Percentage (%)', value: 'percentage' },
                                { label: 'Fixed Amount ($)', value: 'fixed' }
                            ]}
                            value={discountType}
                            onChange={setDiscountType}
                        />
                    </div>
                    <div className="form-field-v2">
                        <label>{discountType === 'percentage' ? 'Discount (%)' : 'Discount ($)'}</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={discountType === 'percentage' ? '20' : '100'}
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="modal-form-footer">
                    <Button variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
                    <Button variant="primary" onClick={handleCreate} fullWidth>Create Coupon</Button>
                </div>
            </ModalFooter>
        </Modal>
    );
}
