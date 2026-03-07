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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        onClick={onClick}
        className="group relative flex items-center gap-4 p-4 rounded-md bg-surface border border-base hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
    >
        <div className="relative w-12 h-12 rounded-lg bg-surface-base border border-base flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
            ) : (
                <Building2 className="w-6 h-6 text-primary/40" />
            )}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-surface rounded-full ${org.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        </div>

        <div className="flex-1 min-w-0">
            <h4 className="text-[14px] font-bold text-primary tracking-tight truncate m-0">{org.name}</h4>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60 bg-primary/5 px-2 py-0.5 rounded">
                    {org.plan}
                </span>
                <span className="text-[10px] font-medium text-muted flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {org.userCount}
                </span>
            </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4 text-muted" />
        </div>
    </motion.div>
);

const OrganizationGrid = ({ loading, organizations, onOrgClick }) => {
    return (
        <div className="card-pro p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-surface-base flex items-center justify-center border border-base">
                        <Building2 className="w-5 h-5 text-muted" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary tracking-tight m-0">Organizations</h3>
                        <p className="text-xs font-medium text-muted m-0">Manage connected business units</p>
                    </div>
                </div>
                <Button variant="ghost" className="h-9 px-4 rounded-md border border-base bg-surface-base hover:bg-surface-elevated text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                    View All
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 overflow-y-auto pr-1">
                {loading
                    ? [1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-md bg-surface-base animate-pulse border border-base" />)
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
