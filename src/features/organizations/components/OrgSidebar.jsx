import { useNavigate } from 'react-router-dom';
import { Edit2, Key, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card';
import Button from '@components/ui/Button';
import { formatDate, formatRelative } from '@utils/format';

export default function OrgSidebar({ org, onResetPassword, onDelete }) {
    const navigate = useNavigate();

    if (!org) return null;

    return (
        <div className="org-content-sidebar">
            <Card>
                <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                <CardContent>
                    <div className="org-actions">
                        <Button variant="secondary" icon={Edit2} fullWidth onClick={() => navigate(`/organizations/${org.id}/edit`)}>
                            Edit Organization
                        </Button>
                        <Button variant="secondary" icon={Key} fullWidth onClick={onResetPassword}>
                            Reset Admin Password
                        </Button>
                        <div className="org-actions__divider" />
                        <Button variant="danger" icon={Trash2} fullWidth onClick={onDelete}>
                            Delete Organization
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
                <CardContent>
                    <div className="org-timeline">
                        <div className="org-timeline__item">
                            <div className="org-timeline__dot org-timeline__dot--green" />
                            <div className="org-timeline__content">
                                <span className="org-timeline__text">Organization created</span>
                                <span className="org-timeline__time">{formatDate(org.created_at)}</span>
                            </div>
                        </div>
                        {org.updated_at && org.updated_at !== org.created_at && (
                            <div className="org-timeline__item">
                                <div className="org-timeline__dot org-timeline__dot--blue" />
                                <div className="org-timeline__content">
                                    <span className="org-timeline__text">Last updated</span>
                                    <span className="org-timeline__time">{formatRelative(org.updated_at)}</span>
                                </div>
                            </div>
                        )}
                        {org.disabled_at && (
                            <div className="org-timeline__item">
                                <div className="org-timeline__dot org-timeline__dot--red" />
                                <div className="org-timeline__content">
                                    <span className="org-timeline__text">Organization disabled</span>
                                    <span className="org-timeline__time">{formatDate(org.disabled_at)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
