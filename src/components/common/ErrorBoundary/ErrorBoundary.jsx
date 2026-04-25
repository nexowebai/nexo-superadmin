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

/**
 * Premium Error Fallback UI
 * Designed for institutional quality and modern aesthetics.
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-6 font-['Open_Sans']">
      {/* Decorative Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#10b981]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#10b981]/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl"
      >
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 pb-0 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6"
            >
              <ShieldAlert className="w-10 h-10 text-[#10b981]" />
            </motion.div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              System Encountered an Issue
            </h1>
            <p className="text-slate-500 max-w-md">
              We've encountered an unexpected error. Our team has been notified
              and we're working to resolve it.
            </p>
          </div>

          {/* Error Details Section */}
          <div className="p-8">
            <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100 relative group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <AlertCircle size={14} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">
                    Technical Details
                  </span>
                </div>

                <button
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg hover:bg-white transition-all text-slate-400 hover:text-[#10b981] border border-transparent hover:border-slate-100"
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
                        <Check size={14} className="text-emerald-500" />
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
              <code className="text-xs text-slate-600 break-all leading-relaxed font-mono block pr-8">
                {error?.message || "Internal Application Error"}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={resetErrorBoundary}
                  className="flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white py-4 px-6 rounded-2xl font-semibold transition-all active:scale-[0.98]"
                >
                  <RefreshCw size={18} />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={handleGoHome}
                  className="flex items-center justify-center gap-2 border-2 border-[#10b981] text-[#10b981] hover:bg-emerald-50/50 py-4 px-6 rounded-2xl font-semibold transition-all active:scale-[0.98]"
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </button>
              </div>

              <button
                onClick={handleGoBack}
                className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 py-4 px-6 rounded-2xl font-semibold transition-all active:scale-[0.98]"
              >
                <ArrowLeft size={18} />
                <span>Go Back to Previous Page</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>
              Reference ID:{" "}
              {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </span>
            <button className="flex items-center gap-1 hover:text-slate-600 transition-colors">
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
