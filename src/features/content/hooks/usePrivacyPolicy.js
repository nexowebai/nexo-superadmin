import { useState, useCallback, useRef } from "react";
import notify from "@utils/notify";
import { DEFAULT_POLICY } from "../constants/policyConstants";

export const usePrivacyPolicy = () => {
  const [content, setContent] = useState(DEFAULT_POLICY);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState("edit");
  const [lastSaved, setLastSaved] = useState(new Date().toLocaleString());
  const textareaRef = useRef(null);

  const insertFormatting = useCallback((prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart: start, selectionEnd: end, value: text } = textarea;
    const finalSuffix = suffix || prefix;
    
    const newText =
      text.substring(0, start) +
      prefix +
      text.substring(start, end) +
      finalSuffix +
      text.substring(end);

    setContent(newText);

    // Maintain focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  }, []);

  const applyColor = useCallback((color) => {
    insertFormatting(`<span style="color: ${color}">`, "</span>");
  }, [insertFormatting]);

  const handlePublish = useCallback(() => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleString());
      notify.success("Privacy policy updated successfully");
    }, 800);
  }, []);

  return {
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
  };
};
