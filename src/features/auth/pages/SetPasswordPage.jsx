import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button, Input, SEO } from '@components/ui';
import { Alert } from '@components/ui/Alert';
import { authService } from '../services/authService';
import './AuthPages.css';

function SetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password', '');

    const getStrength = (pwd) => {
        if (!pwd) return { score: 0, label: '', color: '' };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        if (score <= 2) return { score: 25, label: 'Weak', color: '#ef4444' };
        if (score <= 4) return { score: 50, label: 'Fair', color: '#f59e0b' };
        if (score <= 5) return { score: 75, label: 'Good', color: '#10b981' };
        return { score: 100, label: 'Strong', color: '#059669' };
    };

    const strength = getStrength(password);

    const onSubmit = (data) => {
        if (loading) return;
        if (!token) {
            setError('Invalid setup link.');
            return;
        }

        setLoading(true);
        setError('');

        authService.resetPassword({ token, password: data.password })
            .then(() => {
                setSuccess(true);
            })
            .catch((err) => {
                setError(err.message || 'Failed to set password.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (!token) {
        return (
            <div className="ds-auth-form">
                <Alert variant="error">
                    This setup link is invalid. Contact your administrator.
                </Alert>
            </div>
        );
    }

    if (success) {
        return (
            <div className="ds-auth-form">
                <div className="ds-auth-form__success">
                    <div className="ds-auth-form__success-icon">
                        <CheckCircle size={40} strokeWidth={2.5} />
                    </div>
                    <h1 className="ds-auth-form__title">Account Ready</h1>
                    <p className="ds-auth-form__subtitle">
                        Your account has been successfully set up.<br />Please sign in to continue.
                    </p>
                </div>

                <div className="ds-auth-form__actions">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => navigate('/login')}
                        rightIcon={ArrowRight}
                    >
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="ds-auth-form">
            <SEO
                title="Account Setup"
                description="Complete your Nexo account setup by setting your password."
            />

            <div className="ds-auth-form__header">
                <h1 className="ds-auth-form__title">Set Password</h1>
                <p className="ds-auth-form__subtitle">
                    {email ? <>Create a password for <strong>{email}</strong></> : 'Create a secure password to access your account'}
                </p>
            </div>

            {error && (
                <Alert variant="error" dismissible onDismiss={() => setError('')}>
                    {error}
                </Alert>
            )}

            <form
                className="ds-auth-form__form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="ds-auth-form__field">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        error={errors.password?.message}
                        icon={Lock}
                        rightIcon={showPassword ? EyeOff : Eye}
                        onRightIconClick={() => setShowPassword(!showPassword)}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Min 8 characters'
                            },
                            validate: {
                                hasUpperCase: value => /[A-Z]/.test(value) || 'One uppercase letter',
                                hasLowerCase: value => /[a-z]/.test(value) || 'One lowercase letter',
                                hasNumber: value => /[0-9]/.test(value) || 'One number',
                                hasSpecial: value => /[^A-Za-z0-9]/.test(value) || 'One special character'
                            }
                        })}
                        fullWidth
                    />
                    {password && (
                        <div className="ds-auth-form__strength">
                            <div className="ds-auth-form__strength-bar">
                                <div
                                    className="ds-auth-form__strength-fill"
                                    style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
                                />
                            </div>
                            <span className="ds-auth-form__strength-label" style={{ color: strength.color }}>{strength.label}</span>
                        </div>
                    )}
                </div>

                <div className="ds-auth-form__field">
                    <Input
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        icon={Lock}
                        rightIcon={showConfirmPassword ? EyeOff : Eye}
                        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: value => value === password || 'Passwords do not match'
                        })}
                        fullWidth
                    />
                </div>

                <div className="ds-auth-form__requirements">
                    <p>Security Requirements:</p>
                    <ul>
                        <li className={password.length >= 8 ? 'ds-auth-form__req--met' : ''}>8+ characters</li>
                        <li className={/[A-Z]/.test(password) ? 'ds-auth-form__req--met' : ''}>Uppercase</li>
                        <li className={/[a-z]/.test(password) ? 'ds-auth-form__req--met' : ''}>Lowercase</li>
                        <li className={/[0-9]/.test(password) ? 'ds-auth-form__req--met' : ''}>Number</li>
                        <li className={/[^A-Za-z0-9]/.test(password) ? 'ds-auth-form__req--met' : ''}>Special</li>
                    </ul>
                </div>

                <div className="ds-auth-form__actions">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        rightIcon={ArrowRight}
                    >
                        Setup Account
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default SetPasswordPage;
