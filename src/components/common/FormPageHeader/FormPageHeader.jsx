import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@components/ui';
import { cn } from '@lib/cn';
import './FormPageHeader.css';

function FormPageHeader({
    icon: Icon,
    title,
    description,
    backPath,
    backLabel = 'Back',
    hideBack = false,
    actions,
    className,
}) {
    const navigate = useNavigate();

    return (
        <header className={cn('form-page-header', className)}>
            <div className="form-page-header__left">
                {Icon && (
                    <div className="form-page-header__icon">
                        <Icon size={22} />
                    </div>
                )}
                <div className="form-page-header__text">
                    <h1 className="form-page-header__title">{title}</h1>
                    {description && <p className="form-page-header__desc">{description}</p>}
                </div>
            </div>

            <div className="form-page-header__right">
                {actions}
                {!hideBack && backPath && (
                    <Button
                        variant="secondary"
                        icon={ArrowLeft}
                        onClick={() => navigate(backPath)}
                    >
                        {backLabel}
                    </Button>
                )}
            </div>
        </header>
    );
}

export default FormPageHeader;
