import { motion } from "framer-motion";
import { Building2, Users, FolderKanban } from "lucide-react";
import { CardSkeleton } from "@components/ui/Card/Card";

const smooth = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] };

const OrganizationGrid = ({ loading, organizations, onOrgClick }) => {
    return (
        <motion.div
            className="card-pro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smooth, delay: 0.2 }}
        >
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
                            <motion.div
                                key={org.id}
                                className="org-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ ...smooth, delay: 0.3 + i * 0.08 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
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
                                            <motion.div
                                                className="org-progress__fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${org.storageUsage}%` }}
                                                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default OrganizationGrid;
