import { useEffect } from "react";
import { Globe, Save } from "lucide-react";
import { PageContainer } from "@components/layout/DashboardLayout";
import { Button, Alert } from "@components/ui";
import { useLayout } from "@context";

// Feature-specific
import { PolicyToolbar } from "../components/PolicyToolbar";
import { usePrivacyPolicy } from "../hooks/usePrivacyPolicy";
import { renderPolicyContent } from "../utils/policyParser";
import "./PrivacyPolicy.css";

export default function PrivacyPolicyPage() {
  const { setHeaderProps } = useLayout();
  const {
    content,
    setContent,
    isSaving,
    viewMode,
    setViewMode,
    lastSaved,
    textareaRef,
    insertFormatting,
    applyColor,
    handlePublish,
  } = usePrivacyPolicy();

  // 1. Sync Header Actions
  useEffect(() => {
    setHeaderProps({
      title: "Policy Management",
      action: (
        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon={Globe}
            onClick={() => window.open("/", "_blank")}
            className="h-11 px-6"
          >
            View Live
          </Button>
          <Button
            variant="primary"
            icon={Save}
            loading={isSaving}
            onClick={handlePublish}
            className="h-11 px-6"
          >
            Publish Changes
          </Button>
        </div>
      ),
    });
    return () => setHeaderProps({ title: "", action: null });
  }, [setHeaderProps, isSaving, handlePublish]);

  return (
    <PageContainer>
      <div className="policy-editor-container animate-fade-in">
        {/* Information Alert */}
        <div className="policy-info-bar mb-10">
          <Alert variant="info" title="Global Document Control">
            This document is the official Privacy Policy shared across all Nexo platform interfaces and user applications.
          </Alert>
        </div>

        {/* Primary Editor Surface */}
        <div className="editor-layout shadow-2xl border border-base rounded-2xl overflow-hidden bg-surface">
          <PolicyToolbar
            viewMode={viewMode}
            setViewMode={setViewMode}
            insertFormatting={insertFormatting}
            applyColor={applyColor}
            lastSaved={lastSaved}
          />
          
          <div className="editor-content-area min-h-[900px] transition-all">
            {viewMode === "edit" ? (
              <div className="h-full p-12 md:p-20">
                <textarea
                  ref={textareaRef}
                  className="w-full min-h-[800px] border-none outline-none text-[var(--text-primary)] font-sans text-[18px] leading-relaxed resize-none bg-transparent"
                  placeholder="Draft your legal terms here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  spellCheck={false}
                />
              </div>
            ) : (
              <div className="h-full p-12 md:p-24 animate-fade-in prose-refined w-full max-w-none">
                <div className="max-w-5xl mx-auto">
                  {renderPolicyContent(content)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
