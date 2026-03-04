import { motion } from 'framer-motion';
import { Building2, Power, PowerOff, Bell, Tag, CreditCard } from 'lucide-react';
import { StatusBadge } from '@components/common';
import Button from '@components/ui/Button';
import { formatRelative } from '@utils/format';
import { useNavigate } from 'react-router-dom';

export default function OrgHero({ org, onEnable, onDisable, onNotify, onManagePlan, onManageCoupons }) {
    const navigate = useNavigate();

    if (!org) return null;

    return (
        <motion.div
            className="org-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="org-hero__avatar">
                {org.logo ? (
                    <img src={org.logo} alt={org.name} />
                ) : (
                    <Building2 size={36} strokeWidth={1.5} />
                )}
            </div>
            <div className="org-hero__content">
                <div className="org-hero__title-row">
                    <h1>{org.name}</h1>
                    <StatusBadge status={org.status} size="lg" />
                </div>
                <div className="org-hero__meta">
                    <span className="org-hero__code"><code>#{org.org_code}</code></span>
                    <span className="org-hero__dot">•</span>
                    <span className={`org-hero__tier org-hero__tier--${org.subscription_tier?.toLowerCase()}`}>
                        {org.subscription_tier} Plan
                    </span>
                    <span className="org-hero__dot">•</span>
                    <span className="org-hero__joined">Joined {formatRelative(org.created_at)}</span>
                </div>
            </div>
            <div className="org-hero__actions">
                <Button variant="secondary" icon={Bell} onClick={onNotify} fullWidth>
                    Send Push
                </Button>
                <Button variant="secondary" icon={CreditCard} onClick={onManagePlan} fullWidth>
                    Manage Plan
                </Button>
                <Button variant="secondary" icon={Tag} onClick={onManageCoupons} fullWidth>
                    Discount Coupons
                </Button>
                {org.status === 'disabled' ? (
                    <Button variant="success" icon={Power} onClick={onEnable} fullWidth>Enable Org</Button>
                ) : (
                    <Button variant="danger" icon={PowerOff} onClick={onDisable} fullWidth>Disable Org</Button>
                )}
            </div>
        </motion.div>
    );
}
