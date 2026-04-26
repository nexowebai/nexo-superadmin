import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@components/ui";

export function AuthSuccessState({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="ds-auth-form">
      <div className="ds-auth-form__success">
        <div className="ds-auth-form__success-icon">
          <CheckCircle size={40} strokeWidth={2.5} />
        </div>
        <h1 className="ds-auth-form__title">{title}</h1>
        <p className="ds-auth-form__subtitle">{subtitle}</p>
      </div>

      <div className="ds-auth-form__actions">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onAction}
          rightIcon={ArrowRight}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
