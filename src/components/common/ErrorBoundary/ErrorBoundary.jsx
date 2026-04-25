import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  RefreshCw,
  Home,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@components/ui";

/**
 * Premium Error Fallback UI
 * Redesigned for Nexo Modern Theme
 */
export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const [copied, setCopied] = useState(false);

  const handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const copyToClipboard = () => {
    const textToCopy = error?.message || "Internal Application Error";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-base)] p-6 font-sans text-[var(--text-primary)]">
      {/* Decorative Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--primary-soft)] rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[var(--primary-soft)] rounded-full blur-3xl opacity-70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl"
      >
        <div className="bg-[var(--bg-surface)] rounded-[32px] shadow-[var(--shadow-xl)] border border-[var(--border-base)] overflow-hidden">
          {/* Header Section */}
          <div className="p-8 pb-0 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="w-20 h-20 bg-[var(--primary-soft)] rounded-3xl flex items-center justify-center mb-6"
            >
              <ShieldAlert className="w-10 h-10 text-[var(--primary)]" />
            </motion.div>

            <h1 className="text-2xl font-black text-[var(--text-primary)] mb-2 uppercase tracking-tight">
              System Encountered an Issue
            </h1>
            <p className="text-[var(--text-secondary)] font-bold text-sm max-w-md">
              We've encountered an unexpected error. Our team has been notified
              and we're working to resolve it.
            </p>
          </div>

          {/* Error Details Section */}
          <div className="p-8">
            <div className="bg-[var(--bg-elevated)] rounded-2xl p-4 mb-8 border border-[var(--border-base)] relative group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <AlertCircle size={14} />
                  <span className="text-[10px] uppercase tracking-wider font-black">
                    Technical Details
                  </span>
                </div>
                
                <button 
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-all text-[var(--text-muted)] hover:text-[var(--primary)] border border-transparent hover:border-[var(--border-base)]"
                  title="Copy error message"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Check size={14} className="text-[var(--success)]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Copy size={14} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <code className="text-xs text-[var(--text-secondary)] break-all leading-relaxed font-mono block pr-8 font-bold">
                {error?.message || "Internal Application Error"}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={resetErrorBoundary}
                  className="rounded-2xl h-14"
                  icon={RefreshCw}
                >
                  Try Again
                </Button>
                <Button
                  variant="soft"
                  size="lg"
                  onClick={handleGoHome}
                  className="rounded-2xl h-14 border-2"
                  icon={Home}
                >
                  Dashboard
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleGoBack}
                className="rounded-2xl h-14 border-2 text-secondary"
                icon={ArrowLeft}
              >
                Go Back to Previous Page
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-[var(--bg-subtle)] border-t border-[var(--border-base)] flex items-center justify-between text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
            <span>Ref: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            <button className="flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors">
              Contact Support <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}
