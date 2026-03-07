import { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@components/layout/DashboardLayout';
import { Button, Alert } from '@components/ui';
import { Save, History, Globe, Bold, Italic, Underline, Strikethrough, Code, Eye, Edit3, Type, List, AlignLeft } from 'lucide-react';
import { useLayout } from '@context';
import notify from '@utils/notify';
import './PrivacyPolicy.css';

const DEFAULT_POLICY = `# Privacy Policy for Nexo

**Last Updated:** March 2026

## 1. Introduction
Welcome to **Nexo**. This privacy policy explains how we collect, use, and protect your personal information...

## 2. Information We Collect
We collect information you provide directly to us when you create or modify your account...

## 3. How We Use Your Information
We use the information we collect to deliver and improve our services...
`;

const COLORS = [
    { label: 'Primary', value: '#10b981' },
    { label: 'Blue', value: '#3b82f6' },
    { label: 'Orange', value: '#f97316' },
    { label: 'Purple', value: '#8b5cf6' },
    { label: 'Rose', value: '#e11d48' },
    { label: 'Gray', value: '#475569' },
];

export default function PrivacyPolicyPage() {
    const { setHeaderProps } = useLayout();
    const [content, setContent] = useState(DEFAULT_POLICY);
    const [isSaving, setIsSaving] = useState(false);
    const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview'
    const [lastSaved, setLastSaved] = useState(new Date().toLocaleString());
    const textareaRef = useRef(null);

    useEffect(() => {
        setHeaderProps({
            title: 'Privacy Policy Management',
            action: (
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        icon={Globe}
                        onClick={() => window.open('/', '_blank')}
                    >
                        View Live
                    </Button>
                    <Button
                        variant="primary"
                        icon={Save}
                        loading={isSaving}
                        onClick={handleSave}
                        className="px-6"
                    >
                        Publish Changes
                    </Button>
                </div>
            )
        });
    }, [setHeaderProps, isSaving]);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setLastSaved(new Date().toLocaleString());
            notify.success('Privacy policy updated successfully');
        }, 800);
    };

    const insertFormatting = (prefix, suffix = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        if (!suffix) suffix = prefix;

        const newText = before + prefix + selected + suffix + after;
        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    const applyColor = (color) => {
        insertFormatting(`<span style="color: ${color}">`, '</span>');
    };

    return (
        <PageContainer>
            <div className="policy-editor-container">

                <div className="policy-info-bar mb-6">
                    <Alert variant="info" title="Global Document">
                        This document is the official Privacy Policy shared across all platform interfaces.
                    </Alert>
                </div>

                <div className="editor-layout card-pro shadow-xl">
                    <div className="editor-toolbar-v2 p-4 border-b border-base flex items-center justify-between sticky top-0 bg-surface z-10 rounded-t-xl">
                        <div className="flex items-center gap-1">
                            <div className="toolbar-group flex items-center bg-bg-elevated rounded-lg p-1 mr-4">
                                <button
                                    className={`mode-btn ${viewMode === 'edit' ? 'active' : ''}`}
                                    onClick={() => setViewMode('edit')}
                                >
                                    <Edit3 size={16} /> Edit
                                </button>
                                <button
                                    className={`mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
                                    onClick={() => setViewMode('preview')}
                                >
                                    <Eye size={16} /> Preview
                                </button>
                            </div>

                            {viewMode === 'edit' && (
                                <>
                                    <div className="flex items-center gap-1 border-r border-base pr-3 mr-3">
                                        <button className="editor-tool-btn" onClick={() => insertFormatting('**')}><Bold size={16} /></button>
                                        <button className="editor-tool-btn" onClick={() => insertFormatting('*')}><Italic size={16} /></button>
                                        <button className="editor-tool-btn" onClick={() => insertFormatting('<u>', '</u>')}><Underline size={16} /></button>
                                        <button className="editor-tool-btn" onClick={() => insertFormatting('~~')}><Strikethrough size={16} /></button>
                                    </div>
                                    <div className="flex items-center gap-1 border-r border-base pr-3 mr-3">
                                        <button className="editor-tool-btn" onClick={() => insertFormatting('# ')}><Type size={16} /></button>
                                        <button className="editor-tool-btn" onClick={() => insertFormatting('- ')}><List size={16} /></button>
                                        <button className="editor-tool-btn" onClick={() => insertFormatting('`')}><Code size={16} /></button>
                                    </div>
                                    <div className="flex items-center gap-2 px-2">
                                        {COLORS.map(c => (
                                            <button
                                                key={c.value}
                                                className="w-5 h-5 rounded-full ring-2 ring-transparent hover:ring-primary transition-all shadow-sm"
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
                            <History size={14} />
                            Last saved: {lastSaved}
                        </div>
                    </div>

                    <div className="editor-content-area bg-bg-subtle p-8 min-h-[700px]">
                        {viewMode === 'edit' ? (
                            <div className="paper-container mx-auto bg-surface shadow-lg min-h-[800px] p-6 transition-all">
                                <textarea
                                    ref={textareaRef}
                                    className="w-full h-full min-h-[800px] border-none outline-none text-primary font-mono text-[15px] leading-relaxed resize-none bg-transparent"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Start drafting your policy..."
                                    spellCheck={false}
                                />
                            </div>
                        ) : (
                            <div className="paper-container bg-surface shadow-lg min-h-[800px] p-12 transition-all animate-fade-in">
                                <div className="prose-refined">
                                    {content.split('\n').map((line, i) => (
                                        <p key={i} className="mb-4">
                                            {line.startsWith('# ') ? <h1 className="text-3xl font-black mb-6 border-b pb-4">{line.replace('# ', '')}</h1> :
                                                line.startsWith('## ') ? <h2 className="text-xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2> :
                                                    line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
