import { Skeleton } from '@components/ui/Skeleton/Skeleton';
import { PageContainer } from '@components/layout/DashboardLayout';
import { Card, CardHeader, CardContent } from '@components/ui/Card';

export default function OrgSkeleton() {
    return (
        <PageContainer>
            <div className="org-detail">
                <Skeleton width="150px" height="20px" style={{ marginBottom: 24 }} />
                <div className="org-hero org-hero--skeleton">
                    <Skeleton width="80px" height="80px" borderRadius="16px" />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="280px" height="32px" />
                        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                            <Skeleton width="100px" height="24px" borderRadius="6px" />
                            <Skeleton width="80px" height="24px" borderRadius="6px" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Skeleton width="100px" height="42px" borderRadius="10px" />
                        <Skeleton width="100px" height="42px" borderRadius="10px" />
                    </div>
                </div>
                <div className="org-stats-row">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="org-stat-card org-stat-card--skeleton">
                            <Skeleton width="52px" height="52px" borderRadius="14px" />
                            <div>
                                <Skeleton width="70px" height="28px" />
                                <Skeleton width="90px" height="14px" style={{ marginTop: 6 }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="org-content-grid">
                    <div className="org-content-main">
                        <Card>
                            <CardHeader><Skeleton width="180px" height="20px" /></CardHeader>
                            <CardContent>
                                <div className="org-info-list">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="org-info-item">
                                            <Skeleton width="36px" height="36px" borderRadius="10px" />
                                            <div style={{ flex: 1 }}>
                                                <Skeleton width="60px" height="11px" />
                                                <Skeleton width="140px" height="14px" style={{ marginTop: 6 }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="org-content-sidebar">
                        <Card>
                            <CardHeader><Skeleton width="140px" height="20px" /></CardHeader>
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <Skeleton width="100%" height="42px" borderRadius="10px" />
                                    <Skeleton width="100%" height="42px" borderRadius="10px" />
                                    <Skeleton width="100%" height="42px" borderRadius="10px" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
