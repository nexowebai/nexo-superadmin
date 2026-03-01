import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2 } from 'lucide-react';
import { PageContainer } from '@components/layout/DashboardLayout';
import Button from '@components/ui/Button';
import { ConfirmModal } from '@components/ui/Modal';
import { useOrganizationDetail } from '../../hooks/';
import OrgHero from '../components/OrgHero';
import OrgStats from '../components/OrgStats';
import OrgInfo from '../components/OrgInfo';
import OrgSidebar from '../components/OrgSidebar';
import OrgSkeleton from '../components/OrgSkeleton';
import { DisableOrgModal, ResetPasswordModal } from '../components/OrgModals';
import { useLayout } from '@context';
import '../css/organizations.css';

function OrganizationDetailPage() {
  const { setHeaderProps } = useLayout();
  const {
    org,
    loading,
    modals,
    openModal,
    closeModal,
    handleEnable,
    handleDelete,
    refetch,
    navigate
  } = useOrganizationDetail();

  useEffect(() => {
    if (org) {
      setHeaderProps({
        title: org.name
      });
    }
  }, [setHeaderProps, org]);

  if (loading) return <OrgSkeleton />;

  if (!org) {
    return (
      <PageContainer>
        <div className="org-not-found">
          <Building2 size={56} strokeWidth={1.5} />
          <h2>Organization Not Found</h2>
          <p>The organization you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/organizations')}>Back to Organizations</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="org-detail">

        <OrgHero
          org={org}
          onEnable={handleEnable}
          onDisable={() => openModal('disable')}
        />

        <OrgStats org={org} />

        <div className="org-content-grid">
          <OrgInfo
            org={org}
            onResetPassword={() => openModal('reset')}
          />

          <OrgSidebar
            org={org}
            onResetPassword={() => openModal('reset')}
            onDelete={() => openModal('delete')}
          />
        </div>
      </div>

      <ResetPasswordModal
        isOpen={modals.reset}
        onClose={() => closeModal('reset')}
        orgId={org.id}
        onSuccess={() => refetch()}
      />

      <DisableOrgModal
        isOpen={modals.disable}
        onClose={() => closeModal('disable')}
        orgId={org.id}
        orgName={org.name}
        onSuccess={() => refetch()}
      />

      <ConfirmModal
        isOpen={modals.delete}
        onClose={() => closeModal('delete')}
        onConfirm={handleDelete}
        title="Delete Organization"
        description={`Are you sure you want to delete "${org.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="delete"
      />
    </PageContainer>
  );
}

export default OrganizationDetailPage;
