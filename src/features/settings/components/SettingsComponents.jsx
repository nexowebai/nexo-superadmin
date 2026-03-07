import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle2 } from 'lucide-react';
import { cn } from '@lib/cn';
import { Switch } from '@components/ui';

export const TabWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
    >
        {children}
    </motion.div>
);

export const ConfigCard = ({ icon: Icon, title, desc, children, variant = 'primary' }) => (
    <div className="premium-card bg-surface border border-base rounded-md shadow-sm overflow-hidden">
        <div className="flex items-start gap-5 p-6 border-b border-base bg-surface-subtle">
            <div className={cn(
                "w-12 h-12 rounded-md flex items-center justify-center border shadow-sm shrink-0",
                variant === 'primary' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    variant === 'secondary' ? "bg-blue-50 text-blue-600 border-blue-100" :
                        variant === 'info' ? "bg-sky-50 text-sky-600 border-sky-100" :
                            variant === 'error' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                "bg-zinc-50 text-primary border-base"
            )}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-primary tracking-tight m-0">{title}</h3>
                <p className="text-sm font-medium text-muted opacity-80 m-0 mt-0.5">{desc}</p>
            </div>
        </div>
        <div className="p-8">{children}</div>
    </div>
);

export const Label = ({ text }) => (
    <span className="text-[11px] font-black text-primary uppercase tracking-[0.15em] ml-1">{text}</span>
);

export const InputGroup = ({ label, hint, ...props }) => (
    <div className="space-y-2.5">
        <Label text={label} />
        <input className="premium-input w-full h-11 px-4 bg-white border border-base rounded-md focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all text-sm font-medium" {...props} />
        {hint && <p className="text-[10px] font-bold text-muted/60 lowercase italic ml-1 tracking-wide">{hint}</p>}
    </div>
);

export const ToggleRow = ({ title, desc, checked, onChange }) => (
    <div className="py-6 flex items-center justify-between border-b border-base last:border-0">
        <div className="max-w-[80%]">
            <span className="block font-black text-primary text-base tracking-tight">{title}</span>
            <span className="text-xs font-bold text-muted opacity-70 leading-relaxed">{desc}</span>
        </div>
        <Switch checked={checked} onChange={onChange} />
    </div>
);

export const ThemeChoice = ({ mode, current, onSelect, icon: Icon, label }) => (
    <button
        type="button"
        onClick={() => onSelect(mode)}
        className={cn(
            "flex-1 group relative p-4 rounded-md border-2 transition-all text-left",
            current === mode ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-base hover:border-primary/30"
        )}
    >
        <div className={cn(
            "h-24 rounded-md mb-4 border border-base shadow-inner bg-gradient-to-br",
            mode === 'light' ? "from-white to-zinc-100" : "from-zinc-900 to-black"
        )} />
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon size={16} className={current === mode ? 'text-primary' : 'text-muted'} />
                <span className={cn("text-[11px] font-black uppercase tracking-wider", current === mode ? "text-primary" : "text-secondary")}>
                    {label}
                </span>
            </div>
            {current === mode && <Check size={14} className="text-primary" strokeWidth={3} />}
        </div>
    </button>
);

export const PaletteCard = ({ theme, active }) => (
    <div className={cn(
        "p-4 rounded-md border transition-all cursor-pointer",
        active ? "bg-primary/5 border-primary" : "bg-white border-base hover:border-primary/20"
    )}>
        <div className="flex gap-1.5 mb-3">
            {theme.colors.map((c, i) => <div key={i} className="h-4 flex-1 rounded-md" style={{ background: c }} />)}
        </div>
        <div className="flex justify-between items-center text-[10px] font-black text-muted/60 uppercase tracking-widest">
            {theme.name}
            {active && <CheckCircle2 size={12} className="text-primary" />}
        </div>
    </div>
);
