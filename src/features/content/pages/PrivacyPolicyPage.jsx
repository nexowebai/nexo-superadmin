import { useState, useRef, useEffect } from "react";
import { PageContainer } from "@components/layout/DashboardLayout";
import { Button, Alert } from "@components/ui";
import { Globe, Save } from "lucide-react";
import { useLayout } from "@context";
import notify from "@utils/notify";
import { DEFAULT_POLICY } from "../constants/policyConstants";
import { PolicyToolbar } from "../components/PolicyToolbar";
import "./PrivacyPolicy.css";

export default function PrivacyPolicyPage() {
  const { setHeaderProps } = useLayout();
  const [content, setContent] = useState(DEFAULT_POLICY);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState("edit");
  const [lastSaved, setLastSaved] = useState(new Date().toLocaleString());
  const textareaRef = useRef(null);

  useEffect(() => {
    setHeaderProps({
      title: "Privacy Policy Management",
      action: (
        <div className="flex gap-3">
          <Button variant="secondary" icon={Globe} onClick={() => window.open("/", "_blank")}>View Live</Button>
          <Button variant="primary" icon={Save} loading={isSaving} onClick={() => { setIsSaving(true); setTimeout(() => { setIsSaving(false); setLastSaved(new Date().toLocaleString()); notify.success("Privacy policy updated successfully"); }, 800); }}>Publish Changes</Button>
        </div>
      ),
    });
  }, [setHeaderProps, isSaving]);

  const insertFormatting = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end, value: text } = textarea;
    const finalSuffix = suffix || prefix;
    const newText = text.substring(0, start) + prefix + text.substring(start, end) + finalSuffix + text.substring(end);
    setContent(newText);
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + prefix.length, end + prefix.length); }, 0);
  };

  const applyColor = (color) => insertFormatting(`<span style="color: ${color}">`, "</span>");

  return (
    <PageContainer>
      <div className="policy-editor-container">
        <div className="policy-info-bar mb-6"><Alert variant="info" title="Global Document">Official Privacy Policy shared across all platform interfaces.</Alert></div>
        <div className="editor-layout card-pro shadow-xl">
          <PolicyToolbar viewMode={viewMode} setViewMode={setViewMode} insertFormatting={insertFormatting} applyColor={applyColor} lastSaved={lastSaved} />
          <div className="editor-content-area bg-bg-subtle p-8 min-h-[700px]">
            {viewMode === "edit" ? (
              <div className="paper-container mx-auto bg-surface shadow-lg min-h-[800px] p-6 transition-all">
                <textarea ref={textareaRef} className="w-full h-full min-h-[800px] border-none outline-none text-primary font-mono text-[15px] leading-relaxed resize-none bg-transparent" value={content} onChange={e => setContent(e.target.value)} spellCheck={false} />
              </div>
            ) : (
              <div className="paper-container bg-surface shadow-lg min-h-[800px] p-12 transition-all animate-fade-in prose-refined">
                {content.split("\n").map((line, i) => (
                  <p key={i} className="mb-4">
                    {line.startsWith("# ") ? <h1 className="text-3xl font-black mb-6 border-b pb-4">{line.replace("# ", "")}</h1> : line.startsWith("## ") ? <h2 className="text-xl font-bold mt-8 mb-4">{line.replace("## ", "")}</h2> : line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
