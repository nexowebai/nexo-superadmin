import { Building2, Users, FolderKanban } from "lucide-react";
import { CardSkeleton } from "@components/ui/Card/Card";

const OrganizationGrid = ({ loading, organizations, onOrgClick }) => {
    return (
        <div className="card-pro">
            <div className="card-pro__header">
                <div className="card-pro__header-left">
                    <div className="card-pro__icon">
                        <Building2 size={18} strokeWidth={2.5} />
                    </div>
                    <h3>Active Organizations</h3>
                </div>
            </div>
            <div className="card-pro__content">
                {loading ? (
                    <div className="orgs-skeleton">
                        {[1, 2, 3].map((i) => <CardSkeleton key={i} height={120} />)}
                    </div>
                ) : (
                    <div className="orgs-grid">
                        {organizations.map((org, i) => (
                            <div
                                key={org.id}
                                className="org-card hover:translate-y-[-4px] transition-all duration-200 cursor-pointer"
                                onClick={() => onOrgClick(org.id)}
                            >
                                <div className="org-card__header">
                                    <div className="org-card__avatar">
                                        {org.logo ? <img src={org.logo} alt={org.name} /> : <span>{org.name[0]}</span>}
                                    </div>
                                    <div className="org-card__info">
                                        <h4>{org.name}</h4>
                                        <div className="org-card__meta">
                                            <span className={`plan-badge plan-badge--${org.plan.toLowerCase()}`}>{org.plan}</span>
                                            <span className={`status-dot status-dot--${org.status}`} />
                                        </div>
                                    </div>
                                </div>

                                <div className="org-card__details">
                                    <div className="org-detail-item">
                                        <Users size={14} />
                                        <span>{org.userCount} Users</span>
                                    </div>
                                    <div className="org-detail-item">
                                        <FolderKanban size={14} />
                                        <span>{org.projectCount} Projects</span>
                                    </div>
                                </div>

                                <div className="org-card__footer">
                                    <div className="org-progress">
                                        <div className="org-progress__label">
                                            <span>Storage Usage</span>
                                            <span>{org.storageUsage}%</span>
                                        </div>
                                        <div className="org-progress__bar">
                                            <div
                                                className="org-progress__fill transition-all duration-1000"
                                                style={{ width: `${org.storageUsage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizationGrid;
