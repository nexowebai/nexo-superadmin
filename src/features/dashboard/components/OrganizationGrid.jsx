import React from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@components/ui';

const OrganizationCard = ({ org, onClick, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.3 }}
        onClick={onClick}
        className="group relative flex flex-col items-center justify-center p-6 rounded-md bg-surface-base border border-base hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer aspect-square text-center"
    >
        <div className="relative w-16 h-16 rounded-md bg-surface border border-base flex items-center justify-center overflow-hidden mb-4 shadow-sm group-hover:scale-105 transition-transform">
            {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
            ) : (
                <span className="text-2xl font-bold text-primary/30">{org.name[0]}</span>
            )}
            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-surface rounded-full ${org.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        </div>

        <div className="space-y-1">
            <h4 className="text-sm font-bold text-primary tracking-tight truncate max-w-full px-2">{org.name}</h4>
            <div className="flex flex-col items-center gap-1.5 pt-1">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-surface-elevated rounded-md text-muted/60">
                    {org.plan}
                </span>
                <div className="flex items-center gap-1 opacity-50">
                    <Users className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{org.userCount} Users</span>
                </div>
            </div>
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4 text-primary" />
        </div>
    </motion.div>
);

const OrganizationGrid = ({ loading, organizations, onOrgClick }) => {
    return (
        <div className="p-6 rounded-md bg-surface border border-base shadow-sm relative h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-surface-base flex items-center justify-center border border-base">
                        <Building2 className="w-5 h-5 text-muted" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary tracking-tight m-0">Organizations</h3>
                        <p className="text-xs font-medium text-muted m-0">Manage your connected business units</p>
                    </div>
                </div>
                <Button variant="ghost" className="h-9 px-4 rounded-md border border-base bg-surface-subtle hover:bg-surface-elevated text-[11px] font-bold transition-all shadow-sm">
                    View All
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
                {loading
                    ? [1, 2, 3, 4].map(i => <div key={i} className="aspect-square rounded-md bg-surface-base animate-pulse border border-base" />)
                    : organizations.map((org, i) => (
                        <OrganizationCard
                            key={org.id}
                            org={org}
                            onClick={() => onOrgClick(org.id)}
                            delay={i * 0.05}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default OrganizationGrid;
