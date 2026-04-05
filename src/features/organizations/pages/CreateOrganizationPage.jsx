import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Building2, User, CreditCard, Save } from 'lucide-react';
import { useLayout } from '@context';
import { PageContainer } from '@components/layout/DashboardLayout';
import { Button, Select, Skeleton, DatePicker } from '@components/ui';

// Feature-specific
import { useCreateOrganizationPage } from '../hooks/useCreateOrganizationPage';
import { TIER_OPTIONS, PLAN_OPTIONS } from '../constants/organizationData';
import '../css/organizations.css';

const FormSkeleton = () => (
    <div className="create-form">
        <div className="form-section">
            <div className="form-section-header">
                <Skeleton width="20px" height="20px" borderRadius="4px" />
                <div><Skeleton width="180px" height="20px" /><Skeleton width="240px" height="14px" style={{ marginTop: 8 }} /></div>
            </div>
            <div className="form-grid">
                {[1, 2, 3, 4].map(i => <div key={i} className="form-field"><Skeleton width="100px" height="14px" /><Skeleton width="100%" height="42px" borderRadius="8px" style={{ marginTop: 6 }} /></div>)}
            </div>
        </div>
    </div>
);

export default function CreateOrganizationPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { setHeaderProps } = useLayout();
    const {
        formData, isLoading, creating, updating, isEdit,
        handleChange, handleDropdownChange, handleSubmit
    } = useCreateOrganizationPage(id);

    useEffect(() => {
        setHeaderProps({ title: isEdit ? 'Edit Organization' : 'Add Organization' });
    }, [setHeaderProps, isEdit]);

    return (
        <PageContainer>
            {isLoading ? <FormSkeleton /> : (
                <form className="create-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="form-section-header">
                            <Building2 size={20} />
                            <h3>Organization Details</h3>
                        </div>
                        <div className="form-grid">
                            <div className="form-field"><label>Organization Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Acme Foundation" /></div>
                            <div className="form-field"><label>Organization Code *</label><input type="text" name="org_code" value={formData.org_code} onChange={handleChange} required placeholder="ACM001" disabled={isEdit} /></div>
                            <div className="form-field"><label>Contact Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contact@acme.org" /></div>
                            <div className="form-field"><label>Logo URL</label><input type="url" name="logo" value={formData.logo} onChange={handleChange} placeholder="https://..." /></div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-section-header">
                            <CreditCard size={20} />
                            <h3>Subscription Plan</h3>
                        </div>
                        <div className="form-grid">
                            <div className="form-field"><label>Subscription Tier</label><Select options={TIER_OPTIONS} value={formData.subscription_tier} onChange={(v) => handleDropdownChange('subscription_tier', v)} fullWidth /></div>
                            <div className="form-field"><label>Plan Type</label><Select options={PLAN_OPTIONS} value={formData.plan_type} onChange={(v) => handleDropdownChange('plan_type', v)} fullWidth /></div>
                            <div className="form-field">
                                <label>Expires At</label>
                                <DatePicker 
                                    value={formData.plan_expires_at} 
                                    onChange={(v) => handleDropdownChange('plan_expires_at', v)} 
                                    fullWidth
                                />
                            </div>
                            <div className="form-field"><label>Max Users</label><input type="number" name="max_users" value={formData.max_users} onChange={handleChange} min="1" /></div>
                        </div>
                    </div>

                    {!isEdit && (
                        <div className="form-section">
                            <div className="form-section-header">
                                <User size={20} />
                                <h3>Admin Account</h3>
                            </div>
                            <div className="form-grid">
                                <div className="form-field"><label>Admin Email *</label><input type="email" name="admin_email" value={formData.admin_email} onChange={handleChange} required placeholder="admin@acme.org" /></div>
                                <div className="form-field"><label>Temporary Password *</label><input type="text" name="temp_password" value={formData.temp_password} onChange={handleChange} required placeholder="SecureTemp123!" /></div>
                                <div className="form-field"><label>First Name *</label><input type="text" name="admin_first_name" value={formData.admin_first_name} onChange={handleChange} required placeholder="John" /></div>
                                <div className="form-field"><label>Last Name *</label><input type="text" name="admin_last_name" value={formData.admin_last_name} onChange={handleChange} required placeholder="Doe" /></div>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <Button variant="ghost" type="button" onClick={() => navigate('/organizations')}>Cancel</Button>
                        <Button type="submit" icon={Save} loading={creating || updating}>{isEdit ? 'Update Organization' : 'Add Organization'}</Button>
                    </div>
                </form>
            )}
        </PageContainer>
    );
}
