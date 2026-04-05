import { Users, FolderKanban, FileText, Activity } from 'lucide-react';
import { StatsCard, StatsGrid } from '@components/ui';

export default function OrgStats({ org }) {
    if (!org) return null;

    const usagePercent = org.max_users ? Math.round((org.users_count / org.max_users) * 100) : 0;

    return (
        <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="org-stats-wrapper"
        >
            <StatsGrid>
                <StatsCard
                    variant="nx"
                    icon={Users}
                    value={org.users_count || 0}
                    title="Active Users"
                    trend={org.max_users ? `Max: ${org.max_users}` : null}
                    color="var(--primary)"
                />
                <StatsCard
                    variant="nx"
                    icon={FolderKanban}
                    value={org.projects_count || 0}
                    title="Projects"
                    trend={org.max_projects ? `Limit: ${org.max_projects}` : null}
                    color="var(--info)"
                />
                <StatsCard
                    variant="nx"
                    icon={FileText}
                    value={org.submissions_count || 0}
                    title="Submissions"
                    color="var(--success)"
                />
                <StatsCard
                    variant="nx"
                    icon={Activity}
                    value={`${usagePercent}%`}
                    title="Resource Usage"
                    color="var(--warning)"
                />
            </StatsGrid>
        </div>
    );
}
