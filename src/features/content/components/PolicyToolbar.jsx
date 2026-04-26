import {
  Edit3,
  Eye,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Type,
  List,
  Code,
  History,
} from "lucide-react";
import { COLORS } from "../constants/policyConstants";

const EditIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const PolicyToolbar = ({
  viewMode,
  setViewMode,
  insertFormatting,
  applyColor,
  lastSaved,
}) => (
  <div className="editor-toolbar-v2 p-4 border-b border-base flex items-center justify-between sticky top-0 bg-surface z-10 rounded-t-xl">
    <div className="flex items-center gap-1">
      <div className="toolbar-group flex items-center gap-1.5 bg-bg-elevated rounded-lg p-1 mr-4">
        <button
          className={`mode-btn ${viewMode === "edit" ? "active" : ""}`}
          onClick={() => setViewMode("edit")}
        >
          <EditIcon size={16} /> Edit
        </button>
        <button
          className={`mode-btn ${viewMode === "preview" ? "active" : ""}`}
          onClick={() => setViewMode("preview")}
        >
          <Eye size={16} /> Preview
        </button>
      </div>

      {viewMode === "edit" && (
        <>
          <div className="flex items-center gap-1 border-r border-base pr-3 mr-3">
            <button
              className="editor-tool-btn"
              onClick={() => insertFormatting("**")}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              className="editor-tool-btn"
              onClick={() => insertFormatting("*")}
              title="Italic"
            >
              <Italic size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1 border-r border-base pr-3 mr-3">
            <button
              className="editor-tool-btn"
              onClick={() => insertFormatting("# ")}
              title="Heading 1"
            >
              <Type size={16} />
            </button>
            <button
              className="editor-tool-btn"
              onClick={() => insertFormatting("## ")}
              title="Heading 2"
            >
              <Type size={13} />
            </button>
            <button
              className="editor-tool-btn"
              onClick={() => insertFormatting("- ")}
              title="List"
            >
              <List size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2 px-2">
            {COLORS.map((c) => (
              <button
                key={c.value}
                className="w-5 h-5 rounded-full hover:ring-primary shadow-sm"
                style={{ backgroundColor: c.value }}
                onClick={() => applyColor(c.value)}
                title={c.label}
              />
            ))}
          </div>
        </>
      )}
    </div>
    <div className="text-xs font-bold text-muted flex items-center gap-2">
      <History size={14} /> Last saved: {lastSaved}
    </div>
  </div>
);
