import { motion } from 'framer-motion';
import {
    ArrowUpRight, ArrowDownRight, Building2, Clock,
    MoreHorizontal, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { cn } from '@lib/cn';
import { formatCurrency, formatDate } from '@utils/format';
import { StatusBadge } from '@components/common';
import './RecentTransactions.css';

const MOCK_RECENT = [
    {
        id: 'PAY-821',
        org: 'Hooli Global',
        amount: 12500,
        status: 'completed',
        date: '2026-01-05T14:20:00Z',
        type: 'subscription'
    },
    {
        id: 'PAY-820',
        org: 'Vehement Capital',
        amount: 450,
        status: 'pending',
        date: '2026-01-05T12:15:00Z',
        type: 'extra_projects'
    },
    {
        id: 'PAY-819',
        org: 'Pied Piper',
        amount: 249,
        status: 'failed',
        date: '2026-01-04T09:45:00Z',
        type: 'subscription'
    },
    {
        id: 'PAY-818',
        org: 'Aviato Inc',
        amount: 999,
        status: 'completed',
        date: '2026-01-03T16:30:00Z',
        type: 'professional'
    }
];

export default function RecentTransactions() {
    return (
        <div className="recent-transactions-pro">
            <div className="pro-card-header mb-6">
                <div>
                    <h3 className="text-lg font-black text-primary flex items-center gap-2">
                        <Clock size={18} className="text-primary" />
                        Master Ledger
                    </h3>
                    <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-1 opacity-60">Real-time settlement stream</p>
                </div>
                <button className="h-8 w-8 rounded-lg bg-surface-lowest border border-base flex items-center justify-center text-muted hover:text-primary transition-colors">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            <div className="space-y-3">
                {MOCK_RECENT.map((tx, i) => (
                    <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="tx-item-pro group"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className={cn(
                                "tx-icon-wrapper",
                                tx.status === 'completed' && "bg-success-soft text-success",
                                tx.status === 'pending' && "bg-warning-soft text-warning",
                                tx.status === 'failed' && "bg-error-soft text-error"
                            )}>
                                {tx.status === 'completed' ? <ArrowUpRight size={18} /> :
                                    tx.status === 'failed' ? <ArrowDownRight size={18} /> :
                                        <Clock size={14} />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-primary truncate group-hover:text-primary-hover transition-colors">
                                        {tx.org}
                                    </span>
                                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-surface-lowest border border-base text-muted rounded uppercase tracking-wider">
                                        {tx.id}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Building2 size={10} className="text-muted/60" />
                                    <span className="text-[10px] font-bold text-muted capitalize">
                                        {tx.type.replace('_', ' ')}
                                    </span>
                                    <span className="text-[10px] text-muted/40">•</span>
                                    <span className="text-[10px] font-bold text-muted">
                                        {formatDate(tx.date)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1">
                            <div className="text-sm font-black text-primary">
                                {tx.status === 'failed' ? '-' : '+'}{formatCurrency(tx.amount)}
                            </div>
                            <div className="flex items-center scale-[0.8] origin-right">
                                <StatusBadge status={tx.status} size="sm" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 bg-surface-lowest border border-base/50 rounded-xl text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                Audit All Records
            </button>
        </div>
    );
}
