import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Save } from "lucide-react";
import { useLayout } from "@context";
import { PageContainer } from "@components/layout/DashboardLayout";
import { Button } from "@components/ui";
import { useCreateOrganizationPage } from "../hooks/useCreateOrganizationPage";
import FormSkeleton from "@components/skeletons/FormSkeleton";
import { OrgDetailsSection, SubscriptionSection, AdminAccountSection } from "../components/form/OrgFormSections";
import "../styles/org-form.css";

export default function CreateOrganizationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setHeaderProps } = useLayout();
  const {
    formData, isLoading, creating, updating, isEdit,
    handleChange, handleDropdownChange, handleSubmit,
  } = useCreateOrganizationPage(id);

  useEffect(() => {
    setHeaderProps({ title: isEdit ? "Edit Organization" : "Add Organization" });
    return () => setHeaderProps({ title: "", action: null });
  }, [setHeaderProps, isEdit]);

  if (isLoading) return <PageContainer><FormSkeleton /></PageContainer>;

  return (
    <PageContainer>
      <form className="create-form" onSubmit={handleSubmit}>
        <OrgDetailsSection 
          formData={formData} isEdit={isEdit} 
          handleChange={handleChange} handleDropdownChange={handleDropdownChange} 
        />
        
        <SubscriptionSection 
          formData={formData} 
          handleChange={handleChange} handleDropdownChange={handleDropdownChange} 
        />

        {!isEdit && (
          <AdminAccountSection 
            formData={formData} handleChange={handleChange} 
          />
        )}

        <div className="form-actions">
          <Button variant="secondary" type="button" onClick={() => navigate("/organizations")}>
            Cancel
          </Button>
          <Button type="submit" icon={Save} loading={creating || updating}>
            {isEdit ? "Update Organization" : "Add Organization"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
