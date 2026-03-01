import { useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Shield, Lock, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageContainer } from '@components/layout/DashboardLayout';
import Button from '@components/ui/Button';
import { Skeleton } from '@components/ui/Skeleton/Skeleton';
import { useProfile } from '../../hooks/';
import notify from '@utils/notify';
import './ProfilePage.css';

export default function ProfilePage() {
    const { profile, isLoading, updateProfile, updating, changePassword, changingPassword } = useProfile();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        avatar_url: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                avatar_url: profile.avatar_url || ''
            });
        }
    }, [profile]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
        } catch (err) {
            // Error handled in hook
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            notify.error("Passwords don't match");
            return;
        }
        try {
            await changePassword({
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            // Error handled in hook
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <div className="profile-skeleton">
                    <Skeleton width="100%" height="200px" borderRadius="16px" />
                    <div className="profile-grid mt-8">
                        <Skeleton width="100%" height="400px" borderRadius="16px" />
                        <Skeleton width="100%" height="400px" borderRadius="16px" />
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <motion.div
                className="profile-page"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Hero Header */}
                <div className="profile-hero">
                    <div className="profile-hero__content">
                        <div className="profile-hero__avatar-wrapper">
                            <div className="profile-hero__avatar">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt={formData.full_name} />
                                ) : (
                                    <span>{formData.full_name?.[0]?.toUpperCase() || 'U'}</span>
                                )}
                                <button className="profile-hero__avatar-edit" title="Change Avatar">
                                    <Camera size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="profile-hero__info">
                            <h1>{formData.full_name || 'System Administrator'}</h1>
                            <p>Super Admin • {formData.email}</p>
                        </div>
                    </div>
                </div>

                <div className="profile-grid">
                    {/* Personal Information */}
                    <div className="profile-card">
                        <div className="profile-card__header">
                            <User size={20} className="text-brand-500" />
                            <h3>Personal Information</h3>
                        </div>
                        <form onSubmit={handleProfileSubmit}>
                            <div className="profile-form-grid">
                                <div className="form-field">
                                    <label>Full Name</label>
                                    <div className="input-wrapper">
                                        <User size={16} />
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Email Address</label>
                                    <div className="input-wrapper disabled">
                                        <Mail size={16} />
                                        <input type="email" value={formData.email} disabled />
                                    </div>
                                    <span className="field-hint">Email cannot be changed directly</span>
                                </div>
                                <div className="form-field">
                                    <label>Phone Number</label>
                                    <div className="input-wrapper">
                                        <Phone size={16} />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="profile-card__footer">
                                <Button type="submit" icon={Save} loading={updating}>Save Profile</Button>
                            </div>
                        </form>
                    </div>

                    {/* Security & Password */}
                    <div className="profile-card">
                        <div className="profile-card__header">
                            <Shield size={20} className="text-amber-500" />
                            <h3>Security Settings</h3>
                        </div>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="profile-form-grid">
                                <div className="form-field">
                                    <label>Current Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={16} />
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>New Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={16} />
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Confirm New Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={16} />
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="profile-card__footer">
                                <Button variant="secondary" type="submit" icon={Shield} loading={changingPassword}>Change Password</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </PageContainer>
    );
}
