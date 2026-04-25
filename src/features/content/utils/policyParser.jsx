import React from "react";

/**
 * Transforms raw policy content into semantic HTML elements
 * Handles Markdown-style headers and basic HTML span styling
 */
export const renderPolicyContent = (raw) => {
  if (!raw) return null;

  return raw.split("\n").map((line, i) => {
    // Heading 1: # Header
    if (line.startsWith("# ")) {
      return (
        <h1
          key={i}
          className="text-4xl font-black mb-8 text-[var(--text-primary)] border-b border-base pb-6"
        >
          {line.replace("# ", "")}
        </h1>
      );
    }

    // Heading 2: ## Header
    if (line.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="text-2xl font-extrabold mt-10 mb-5 text-[var(--text-primary)]"
        >
          {line.replace("## ", "")}
        </h2>
      );
    }

    // Empty Lines
    if (line.trim() === "") return <div key={i} className="h-4" />;

    // Transform markdown-like bold/italic to HTML
    const formattedLine = line
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Paragraph with dangerouslySetInnerHTML for custom spans
    return (
      <p
        key={i}
        className="mb-4 text-[var(--text-secondary)] leading-relaxed text-[17px]"
        dangerouslySetInnerHTML={{ __html: formattedLine }}
      />
    );
  });
};
