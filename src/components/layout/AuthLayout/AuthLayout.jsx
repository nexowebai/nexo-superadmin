import { Outlet } from "react-router-dom";
import AuthVisual from "@features/auth/components/AuthVisual";
import nexoFull from "@assets/logo/nexo-full.png";
import "./AuthLayout.css";

function AuthLayout() {
  return (
    <div className="ds-auth">
      {/* Left - Premium Showcase */}
      <div className="ds-auth__showcase">
        <div className="ds-auth__showcase-glow" />

        <div className="ds-auth__showcase-content">
          {/* Visual Illustration */}
          <div className="ds-auth__visual">
            <AuthVisual />
          </div>

          {/* Brand Text */}
          <div className="ds-auth__brand">
            <h1 className="ds-auth__headline">
              Nexo - Manage <span>Smarter</span>
            </h1>
            <p className="ds-auth__tagline">
              Empowering field officers with real-time insights and seamless
              collaboration.
            </p>
          </div>
        </div>

        {/* Trust Section */}
        <div className="ds-auth__trust">
          <span className="ds-auth__trust-label">
            Trusted by leading organizations
          </span>
          <div className="ds-auth__trust-logos">
            <span>Enterprise Co</span>
            <span>•</span>
            <span>GlobalTech</span>
            <span>•</span>
            <span>StartupX</span>
          </div>
        </div>
      </div>

      {/* Right - Form Side */}
      <div className="ds-auth__form-side">
        <div className="ds-auth__form-container">
          {/* Global Branding Logo for Auth Pages */}
          <div className="ds-auth__logo-header">
            <img src={nexoFull} alt="Nexo Logo" className="ds-auth__logo-img" />
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
