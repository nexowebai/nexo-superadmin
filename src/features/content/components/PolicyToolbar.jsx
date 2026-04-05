import { Edit3, Eye, Bold, Italic, Underline, Strikethrough, Type, List, Code, History } from "lucide-react";
import { COLORS } from "../constants/policyConstants";

export const PolicyToolbar = ({ viewMode, setViewMode, insertFormatting, applyColor, lastSaved }) => (
  <div className="editor-toolbar-v2 p-4 border-b border-base flex items-center justify-between sticky top-0 bg-surface z-10 rounded-t-xl">
    <div className="flex items-center gap-1">
      <div className="toolbar-group flex items-center gap-1.5 bg-bg-elevated rounded-lg p-1 mr-4">
        <button className={`mode-btn ${viewMode === "edit" ? "active" : ""}`} onClick={() => setViewMode("edit")}><Edit3 size={16} /> Edit</button>
        <button className={`mode-btn ${viewMode === "preview" ? "active" : ""}`} onClick={() => setViewMode("preview")}><Eye size={16} /> Preview</button>
      </div>

      {viewMode === "edit" && (
        <>
          <div className="flex items-center gap-1 border-r border-base pr-3 mr-3">
            <button className="editor-tool-btn" onClick={() => insertFormatting("**")}><Bold size={16} /></button>
            <button className="editor-tool-btn" onClick={() => insertFormatting("*")}><Italic size={16} /></button>
            <button className="editor-tool-btn" onClick={() => insertFormatting("<u>", "</u>")}><Underline size={16} /></button>
            <button className="editor-tool-btn" onClick={() => insertFormatting("~~")}><Strikethrough size={16} /></button>
          </div>
          <div className="flex items-center gap-1 border-r border-base pr-3 mr-3">
            <button className="editor-tool-btn" onClick={() => insertFormatting("# ")}><Type size={16} /></button>
            <button className="editor-tool-btn" onClick={() => insertFormatting("- ")}><List size={16} /></button>
            <button className="editor-tool-btn" onClick={() => insertFormatting("`")}><Code size={16} /></button>
          </div>
          <div className="flex items-center gap-2 px-2">
            {COLORS.map(c => <button key={c.value} className="w-5 h-5 rounded-full hover:ring-primary shadow-sm" style={{ backgroundColor: c.value }} onClick={() => applyColor(c.value)} title={c.label} />)}
          </div>
        </>
      )}
    </div>
    <div className="text-xs font-bold text-muted flex items-center gap-2"><History size={14} /> Last saved: {lastSaved}</div>
  </div>
);
