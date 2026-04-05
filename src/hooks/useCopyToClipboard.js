import { useState, useCallback } from "react";

export const useCopyToClipboard = () => {
  const [copiedId, setCopiedId] = useState(null);

  const copy = useCallback((text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  return [copiedId, copy];
};
