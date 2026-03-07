import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { PageContainer } from '@components/layout/DashboardLayout';
import { useLayout } from '@context';
import Button from '@components/ui/Button';
import { useCreateAdmin } from '../hooks/useAdmins';
import notify from '@utils/notify';

const initialFormData = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  phone_number: '',
};

function CreateAdminPage() {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();

  useEffect(() => {
    setHeaderProps({ title: 'Create Admin' });
  }, [setHeaderProps]);
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { mutate: createAdmin, isPending } = useCreateAdmin();

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const generatePassword = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleChange('password', password);
  }, [handleChange]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!validate()) return;

    notify.promise(
      new Promise((resolve, reject) => {
        createAdmin(formData, {
          onSuccess: () => {
            navigate('/admins');
            resolve();
          },
          onError: reject,
        });
      }),
      {
        loading: 'Creating admin...',
        success: 'Admin created successfully',
        error: (err) => err?.message || 'Failed to create admin',
      }
    );
  }, [formData, validate, createAdmin, navigate]);

  return (
    <PageContainer>
      <form onSubmit={handleSubmit} className="create-form">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="form-section">
            <div className="form-section-header">
              <Shield size={20} />
              <div>
                <h3>Admin Account Details</h3>
                <p>Enter the admin account information</p>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label>First Name *</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  placeholder="John"
                  required
                />
                {errors.first_name && <span className="form-error">{errors.first_name}</span>}
              </div>
              <div className="form-field">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  placeholder="Doe"
                  required
                />
                {errors.last_name && <span className="form-error">{errors.last_name}</span>}
              </div>
              <div className="form-field">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="admin@platform.com"
                  required
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
              <div className="form-field">
                <label>Password *</label>
                <div className="input-with-action">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              <div className="form-field">
                <label>&nbsp;</label>
                <Button type="button" variant="secondary" onClick={generatePassword}>
                  Generate Password
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="form-actions">
          <Button variant="ghost" type="button" onClick={() => navigate('/admins')}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Create Admin
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

export default CreateAdminPage;
