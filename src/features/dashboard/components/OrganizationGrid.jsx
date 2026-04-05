import React from 'react';
import { Building2, Users, ChevronRight } from 'lucide-react';
import { Button, Card } from '@components/ui';
import { SkeletonCard } from '@components/ui/Skeleton/Skeleton';

const OrganizationCard = ({ org, onClick }) => (
    <Card 
        onClick={onClick} 
        padding="md"
        hover
        className="org-grid-card group"
    >
        <div className="org-grid-card__logo-wrapper">
            {org.logo ? (
                <img src={org.logo} alt={org.name} className="org-grid-card__logo" />
            ) : (
                <Building2 size={20} className="org-grid-card__icon--placeholder" />
            )}
            <div className={`org-grid-card__status-dot ${org.status === 'active' ? 'is-active' : 'is-pending'}`} />
        </div>

        <div className="org-grid-card__content">
            <h4 className="org-grid-card__title">{org.name}</h4>
            <div className="org-grid-card__meta">
                <span className="org-grid-card__plan">{org.plan}</span>
                <span className="org-grid-card__separator">•</span>
                <span className="org-grid-card__users">{org.userCount} Members</span>
            </div>

            <div className="org-grid-card__footer">
                <Users size={12} />
                <span>Team Access Active</span>
            </div>
        </div>

        <div className="org-grid-card__action">
            <ChevronRight size={14} />
        </div>
    </Card>
);

const OrganizationGrid = ({ loading, organizations, onOrgClick }) => {
    return (
        <Card variant="pro" padding="md" className="org-grid-container">
            <div className="org-grid-header">
                <div className="org-grid-header__info">
                    <div className="org-grid-header__icon">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h3 className="org-grid-header__title">Organizations</h3>
                        <p className="org-grid-header__subtitle">Business Units Hub</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="org-grid-header__action">
                    View Managed
                </Button>
            </div>

            <div className="org-grid-body">
                {loading
                    ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} showAvatar />)
                    : organizations.map((org) => (
                        <OrganizationCard
                            key={org.id}
                            org={org}
                            onClick={() => onOrgClick(org.id)}
                        />
                    ))
                }
            </div>
        </Card>
    );
};

export default OrganizationGrid;
