import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  ArrowLeft,
  Bug,
  Zap,
} from "lucide-react";
import "./ErrorPage.css";

const spring = { type: "spring", stiffness: 300, damping: 30 };

export default function ErrorPage({ error, reset }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate({ to: "/dashboard" });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleRefresh = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  const errorMessage = error?.message || "An unexpected error occurred";
  const isModuleError =
    errorMessage.includes("module") || errorMessage.includes("import");

  return (
    <div className="error-page">
      <div className="error-page__bg">
        <div className="error-page__orb error-page__orb--1" />
        <div className="error-page__orb error-page__orb--2" />
        <div className="error-page__orb error-page__orb--3" />
      </div>

      <motion.div
        className="error-page__content"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={spring}
      >
        <motion.div
          className="error-page__icon"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <div className="error-page__icon-inner">
            {isModuleError ? <Bug /> : <AlertTriangle />}
          </div>
          <motion.div
            className="error-page__icon-ring"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          className="error-page__text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="error-page__title">
            {isModuleError ? "Loading Error" : "Oops! Something went wrong"}
          </h1>
          <p className="error-page__description">
            {isModuleError
              ? "We couldn't load part of the application. This might be due to a network issue or a recent update."
              : "Don't worry, it happens to the best of us. Let's get you back on track."}
          </p>
        </motion.div>

        <motion.div
          className="error-page__details"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.3 }}
        >
          <div className="error-page__details-header">
            <Zap size={14} />
            <span>Error Details</span>
          </div>
          <code className="error-page__code">{errorMessage}</code>
        </motion.div>

        <motion.div
          className="error-page__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            className="error-page__btn error-page__btn--primary"
            onClick={handleRefresh}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw size={18} />
            <span>Try Again</span>
          </motion.button>

          <motion.button
            className="error-page__btn error-page__btn--secondary"
            onClick={handleGoHome}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home size={18} />
            <span>Go to Dashboard</span>
          </motion.button>

          <motion.button
            className="error-page__btn error-page__btn--ghost"
            onClick={handleGoBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="error-page__footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>If this issue persists, please contact support.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
