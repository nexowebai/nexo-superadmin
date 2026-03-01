import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, User, CreditCard, Save } from 'lucide-react';
import { PageContainer } from '@components/layout/DashboardLayout';
import { useLayout } from '@context';
import Button from '@components/ui/Button';
import { Select } from '@components/common';
import { Skeleton } from '@components/ui/Skeleton/Skeleton';
import { useOrganization, useCreateOrganization, useUpdateOrganization } from '../../hooks/';
import notify from '@utils/notify';
import '../css/organizations.css';

const TIER_OPTIONS = [
    { value: 'basic', label: 'Basic' },
    { value: 'professional', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' },
];

const PLAN_OPTIONS = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly (Save 20%)' },
];

function FormSkeleton() {
    return (
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
}

function CreateOrganizationPage() {
    const navigate = useNavigate();
    const { setHeaderProps } = useLayout();
    const { id } = useParams();
    const isEdit = !!id;
    const initialDataRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', org_code: '', email: '', logo: '',
        subscription_tier: 'professional', plan_type: 'yearly',
        max_users: 50, max_projects: 25, plan_expires_at: '',
        admin_email: '', admin_first_name: '', admin_last_name: '', admin_phone: '', temp_password: '',
    });

    useEffect(() => {
        setHeaderProps({ title: isEdit ? 'Edit Organization' : 'Add Organization' });
    }, [setHeaderProps, isEdit]);

    const { data: orgData, isLoading } = useOrganization(id);
    const { mutateAsync: createOrg, isPending: creating } = useCreateOrganization();
    const { mutateAsync: updateOrg, isPending: updating } = useUpdateOrganization();

    useEffect(() => {
        if (isEdit && orgData) {
            const initialValues = {
                name: orgData.name || '',
                org_code: orgData.org_code || '',
                email: orgData.email || '',
                logo: orgData.logo || '',
                subscription_tier: orgData.subscription_tier || 'professional',
                plan_type: orgData.plan_type || 'yearly',
                max_users: orgData.max_users || 50,
                max_projects: orgData.max_projects || 25,
                plan_expires_at: orgData.plan_expires_at ? orgData.plan_expires_at.split('T')[0] : '',
            };
            initialDataRef.current = initialValues;
            setFormData(prev => ({ ...prev, ...initialValues }));
        }
    }, [isEdit, orgData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload;
        if (isEdit) {
            const changedFields = {};
            const initial = initialDataRef.current || {};
            Object.keys(formData).forEach(key => {
                if (formData[key] !== initial[key]) {
                    changedFields[key] = (key === 'max_users' || key === 'max_projects') ? parseInt(formData[key]) : formData[key];
                }
            });
            payload = changedFields;
        } else {
            payload = {
                ...formData,
                max_users: parseInt(formData.max_users),
                max_projects: parseInt(formData.max_projects),
                plan_expires_at: formData.plan_expires_at ? new Date(formData.plan_expires_at).toISOString() : undefined,
            };
        }

        const promise = isEdit ? updateOrg({ id, data: payload }) : createOrg(payload);

        notify.promise(
            promise.then(() => navigate(isEdit ? `/organizations/${id}` : '/organizations')),
            {
                loading: isEdit ? 'Updating organization...' : 'Creating organization...',
                success: isEdit ? 'Organization updated successfully!' : 'Organization created successfully!',
                error: (err) => err?.message || 'Operation failed',
            }
        );
    };

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
                            <div className="form-field"><label>Expires At</label><input type="date" name="plan_expires_at" value={formData.plan_expires_at} onChange={handleChange} /></div>
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

export default CreateOrganizationPage;
