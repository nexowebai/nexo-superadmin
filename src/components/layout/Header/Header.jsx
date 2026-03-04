import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Menu } from "lucide-react";
import { useLayout } from "@context";
import { Button } from "@components/ui";
import "./Header.css";

function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { title, action, showRefresh } = useLayout();

  return (
    <header className="ds-header">
      <div className="ds-header__left">
        <button
          className="ds-header__menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="ds-header__title">{title}</h1>

        {showRefresh !== false && (
          <div
            className="ds-header__refresh"
            onClick={() => window.location.reload()}
            role="button"
            tabIndex={0}
            aria-label="Refresh page"
          >
            <RefreshCw size={16} />
          </div>
        )}
      </div>

      <div className="ds-header__right">
        <Button
          variant="outline"
          size="xl"
          leftIcon={ArrowLeft}
          onClick={() => navigate(-1)}
          className="ds-header__back-btn"
        >
          Back
        </Button>

        <div className="ds-header__action">
          {action}
        </div>
      </div>
    </header>
  );
}

export default Header;
