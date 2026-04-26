import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageContainer } from "@components/layout/DashboardLayout";
import { Skeleton } from "@components/ui/Skeleton/Skeleton";
import { useProfile } from "../../auth/hooks/useProfile";
import notify from "@utils/notify";
import { ProfileHero, PersonalInfoCard, SecuritySettingsCard } from "../components/ProfileComponents";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { profile, isLoading, updateProfile, updating, changePassword, changingPassword } = useProfile();
  
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "", avatar_url: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify.error("Passwords don't match");
      return;
    }
    changePassword({ oldPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      .then(() => setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  if (isLoading) return <ProfileSkeleton />;

  return (
    <PageContainer>
      <motion.div className="profile-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <ProfileHero avatar_url={formData.avatar_url} full_name={formData.full_name} email={formData.email} />
        
        <div className="profile-grid">
          <PersonalInfoCard formData={formData} setFormData={setFormData} onSubmit={handleProfileSubmit} loading={updating} />
          <SecuritySettingsCard passwordData={passwordData} setPasswordData={setPasswordData} onSubmit={handlePasswordSubmit} loading={changingPassword} />
        </div>
      </motion.div>
    </PageContainer>
  );
}

function ProfileSkeleton() {
  return (
    <PageContainer>
      <div className="profile-skeleton">
        <Skeleton width="100%" height="200px" borderRadius="16px" />
        <div className="profile-grid mt-8">
          <Skeleton width="100%" height="400px" borderRadius="16px" />
          <Skeleton width="100%" height="400px" borderRadius="16px" />
        </div>
      </div>
    </PageContainer>
  );
}
