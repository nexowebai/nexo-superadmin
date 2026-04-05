export const MOCK_TASKS = [
  {
    id: "task1",
    title: "Complete Kinondoni District Survey",
    description:
      "Finish all pending household surveys in Kinondoni district by end of week",
    project_id: "a30617b1-3f6f-4576-83d2-60089017b1e1",
    project_name: "Urban Slum Living Conditions Assessment",
    assigned_to: {
      id: "fo1",
      full_name: "James Mutua",
      profile_image: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    assigned_by: { id: "m1", full_name: "John Kariuki" },
    deadline: "2026-01-15T17:00:00.000000Z",
    priority: "high",
    status: "in_progress",
    target_submissions: 50,
    completed_submissions: 32,
    created_at: "2026-01-08T09:00:00.000000Z",
  },
  {
    id: "task2",
    title: "Data Quality Review",
    description: "Review and validate all submissions from last week",
    project_id: "a30617b1-3f6f-4576-83d2-60089017b1e1",
    project_name: "Urban Slum Living Conditions Assessment",
    assigned_to: {
      id: "m2",
      full_name: "Sarah Mwangi",
      profile_image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    assigned_by: { id: "m1", full_name: "John Kariuki" },
    deadline: "2026-01-14T12:00:00.000000Z",
    priority: "medium",
    status: "pending",
    target_submissions: 100,
    completed_submissions: 0,
    created_at: "2026-01-10T11:30:00.000000Z",
  },
];

export const TEMPLATE_FORMS = [
  {
    id: "tpl1",
    form_code: "TPL-HHS001",
    name: "Household Survey Template",
    fields_count: 45,
    created_at: "2025-10-15T10:00:00.000000Z",
    source_project: "Urban Slum Living Conditions Assessment",
    usage_count: 12,
  },
  {
    id: "tpl2",
    form_code: "TPL-FBK001",
    name: "Feedback Form Template",
    fields_count: 12,
    created_at: "2025-11-20T14:30:00.000000Z",
    source_project: "Urban Slum Living Conditions Assessment",
    usage_count: 8,
  },
];
