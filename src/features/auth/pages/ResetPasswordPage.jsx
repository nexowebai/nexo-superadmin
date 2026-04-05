import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button, Input, SEO } from '@components/ui';
import { Alert } from '@components/ui/Alert';
import { authService } from '../services/authService';
import './AuthPages.css';

function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

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

    const password = watch('password');

    const onSubmit = (data) => {
        if (loading) return;
        if (!token) {
            setError('Invalid reset link. Please request a new one.');
            return;
        }

        setLoading(true);
        setError('');

        authService.resetPassword({ token, password: data.password })
            .then(() => {
                setSuccess(true);
            })
            .catch((err) => {
                setError(err.message || 'Reset failed. The link may have expired.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (!token) {
        return (
            <div className="ds-auth-form">
                <Alert variant="error">
                    This reset link is invalid or has expired.
                </Alert>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Link to="/forgot-password" className="ds-auth-form__back-link">
                        <ArrowLeft size={16} />
                        Request new link
                    </Link>
                </div>
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
                    <h1 className="ds-auth-form__title">Password reset</h1>
                    <p className="ds-auth-form__subtitle">
                        Your password has been updated successfully.
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
                title="Reset Password"
                description="Create a new secure password for your Nexo account."
            />

            <div className="ds-auth-form__header">
                <h1 className="ds-auth-form__title">New Password</h1>
                <p className="ds-auth-form__subtitle">
                    Create a strong, unique password for your account.
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
                        label="New Password"
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
                                message: 'Password must be at least 8 characters'
                            },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[0-9])/,
                                message: 'Must contain one uppercase letter and one number'
                            }
                        })}
                        fullWidth
                    />
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

                <div className="ds-auth-form__actions">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        rightIcon={ArrowRight}
                    >
                        Reset Password
                    </Button>
                </div>
            </form>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link to="/login" className="ds-auth-form__back-link">
                    <ArrowLeft size={16} />
                    Back to login
                </Link>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
