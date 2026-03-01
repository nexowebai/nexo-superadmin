import { motion } from 'framer-motion';
import { Users, FolderKanban, FileText, Activity } from 'lucide-react';

function StatCard({ icon: Icon, value, label, subValue, color = 'blue' }) {
    return (
        <motion.div
            className={`org-stat-card org-stat-card--${color}`}
            whileHover={{ y: -3, boxShadow: '0 12px 40px -12px rgba(0,0,0,0.12)' }}
            transition={{ duration: 0.2 }}
        >
            <div className="org-stat-card__icon">
                <Icon size={24} />
            </div>
            <div className="org-stat-card__content">
                <div className="org-stat-card__value">
                    {value}
                    {subValue && <span className="org-stat-card__sub">/{subValue}</span>}
                </div>
                <div className="org-stat-card__label">{label}</div>
            </div>
        </motion.div>
    );
}

export default function OrgStats({ org }) {
    if (!org) return null;

    const usagePercent = org.max_users ? Math.round((org.users_count / org.max_users) * 100) : 0;

    return (
        <motion.div
            className="org-stats-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
        >
            <StatCard icon={Users} value={org.users_count || 0} subValue={org.max_users} label="Active Users" color="blue" />
            <StatCard icon={FolderKanban} value={org.projects_count || 0} subValue={org.max_projects} label="Projects" color="purple" />
            <StatCard icon={FileText} value={org.submissions_count || 0} label="Submissions" color="green" />
            <StatCard icon={Activity} value={`${usagePercent}%`} label="Resource Usage" color="orange" />
        </motion.div>
    );
}
