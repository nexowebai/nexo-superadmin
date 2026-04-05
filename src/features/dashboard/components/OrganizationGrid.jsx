import React from 'react';
import {
    Building2,
    Users,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@components/ui';

const OrganizationCard = ({ org, onClick }) => (
    <div
        onClick={onClick}
        className="group relative flex items-start gap-4 p-4 rounded-md bg-surface border border-base hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative w-10 h-10 rounded-md bg-surface-base border border-base flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-sm">
            {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
            ) : (
                <Building2 className="w-5 h-5 text-primary opacity-50" />
            )}
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-surface rounded-full ${org.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'}`} />
        </div>

        <div className="relative min-w-0 flex-1 pr-6">
            <h4 className="text-[13px] font-bold text-primary tracking-tight leading-tight truncate m-0 group-hover:text-primary transition-colors">
                {org.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                    {org.plan}
                </span>
                <span className="text-[10px] font-medium text-muted/20">•</span>
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{org.userCount} Members</span>
            </div>

            <div className="flex items-center gap-1.5 mt-2.5 opacity-40 group-hover:opacity-70 transition-opacity">
                <Users className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Team Access Active</span>
            </div>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                <ChevronRight className="w-3.5 h-3.5" />
            </div>
        </div>
    </div>
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
                        <p className="text-xs font-medium text-muted m-0">Business Units Hub</p>
                    </div>
                </div>
                <Button variant="ghost" className="h-9 px-4 rounded-md border border-base bg-surface-base hover:bg-surface-elevated text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                    View Managed
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1">
                {loading
                    ? [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-24 rounded-md bg-surface-base animate-pulse border border-base" />)
                    : organizations.map((org, i) => (
                        <OrganizationCard
                            key={org.id}
                            org={org}
                            onClick={() => onOrgClick(org.id)}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default OrganizationGrid;
