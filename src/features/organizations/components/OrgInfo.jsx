import { motion } from 'framer-motion';
import { Mail, Phone, Globe, CreditCard, Clock, Calendar, Copy, Shield, CheckCircle2, Key } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card';
import Button from '@components/ui/Button';
import notify from '@utils/notify';
import { formatDate } from '@utils/format';

function InfoItem({ icon: Icon, label, value, copyable }) {
    const handleCopy = () => {
        if (value && copyable) {
            navigator.clipboard.writeText(String(value));
            notify.success('Copied to clipboard');
        }
    };

    return (
        <div
            className={`org-info-item ${copyable ? 'org-info-item--copyable' : ''}`}
            onClick={copyable ? handleCopy : undefined}
        >
            <div className="org-info-item__icon">
                <Icon size={18} />
            </div>
            <div className="org-info-item__content">
                <span className="org-info-item__label">{label}</span>
                <span className="org-info-item__value">
                    {value || '—'}
                    {copyable && value && <Copy size={12} className="org-info-item__copy" />}
                </span>
            </div>
        </div>
    );
}

export default function OrgInfo({ org, onResetPassword }) {
    if (!org) return null;

    const usagePercent = org.max_users ? Math.round((org.users_count / org.max_users) * 100) : 0;
    const projectPercent = org.max_projects ? Math.round((org.projects_count / org.max_projects) * 100) : 0;

    return (
        <div className="org-content-main">
            <Card className="org-info-card">
                <CardHeader><CardTitle>Organization Details</CardTitle></CardHeader>
                <CardContent>
                    <div className="org-info-list">
                        <InfoItem icon={Mail} label="Email" value={org.email} copyable />
                        <InfoItem icon={Phone} label="Phone" value={org.admin?.phone_number} copyable />
                        <InfoItem icon={Globe} label="Website" value={org.website} />
                        <InfoItem icon={CreditCard} label="Plan Type" value={org.plan_type?.toUpperCase()} />
                        <InfoItem icon={Clock} label="Plan Expires" value={formatDate(org.plan_expires_at)} />
                        <InfoItem icon={Calendar} label="Created" value={formatDate(org.created_at)} />
                    </div>

                    {/* Usage Bars */}
                    <div className="org-usage-section">
                        <h4>Resource Allocation</h4>
                        <div className="org-usage-bar">
                            <div className="org-usage-bar__header">
                                <span>Users</span>
                                <span>{org.users_count || 0} / {org.max_users || 0}</span>
                            </div>
                            <div className="org-usage-bar__track">
                                <motion.div
                                    className="org-usage-bar__fill org-usage-bar__fill--green"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(usagePercent, 100)}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                />
                            </div>
                        </div>
                        <div className="org-usage-bar">
                            <div className="org-usage-bar__header">
                                <span>Projects</span>
                                <span>{org.projects_count || 0} / {org.max_projects || 0}</span>
                            </div>
                            <div className="org-usage-bar__track">
                                <motion.div
                                    className="org-usage-bar__fill org-usage-bar__fill--teal"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(projectPercent, 100)}%` }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                />
                            </div>
                        </div>
                    </div>

                    {org.disabled_reason && (
                        <div className="org-alert org-alert--warning">
                            <Shield size={20} />
                            <div>
                                <strong>Disabled</strong>
                                <p>{org.disabled_reason}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Admin Info */}
            {org.admin && (
                <Card className="org-admin-card">
                    <CardHeader><CardTitle>Primary Administrator</CardTitle></CardHeader>
                    <CardContent>
                        <div className="org-admin">
                            <div className="org-admin__avatar">
                                {org.admin.full_name?.charAt(0) || 'A'}
                            </div>
                            <div className="org-admin__info">
                                <h4>{org.admin.full_name}</h4>
                                <span className="org-admin__email">{org.admin.email}</span>
                                {org.admin.phone_number && (
                                    <span className="org-admin__phone">
                                        <Phone size={12} /> {org.admin.phone_number}
                                    </span>
                                )}
                                <div className="org-admin__status">
                                    <CheckCircle2 size={14} />
                                    <span>{org.admin.is_active !== false ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                            <Button size="sm" variant="secondary" icon={Key} onClick={onResetPassword}>
                                Reset Password
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
