export const COUNTRIES_WITH_REGIONS = [
  {
    value: "tanzania",
    label: "Tanzania",
    regions: [
      { value: "dar_es_salaam", label: "Dar es Salaam" },
      { value: "arusha", label: "Arusha" },
      { value: "mwanza", label: "Mwanza" },
      { value: "dodoma", label: "Dodoma" },
      { value: "tanga", label: "Tanga" },
      { value: "morogoro", label: "Morogoro" },
      { value: "mbeya", label: "Mbeya" },
      { value: "zanzibar", label: "Zanzibar" },
    ],
  },
  {
    value: "kenya",
    label: "Kenya",
    regions: [
      { value: "nairobi", label: "Nairobi" },
      { value: "mombasa", label: "Mombasa" },
      { value: "kisumu", label: "Kisumu" },
      { value: "nakuru", label: "Nakuru" },
      { value: "eldoret", label: "Eldoret" },
    ],
  },
  {
    value: "uganda",
    label: "Uganda",
    regions: [
      { value: "kampala", label: "Kampala" },
      { value: "entebbe", label: "Entebbe" },
      { value: "jinja", label: "Jinja" },
      { value: "mbarara", label: "Mbarara" },
      { value: "gulu", label: "Gulu" },
    ],
  },
  {
    value: "rwanda",
    label: "Rwanda",
    regions: [
      { value: "kigali", label: "Kigali" },
      { value: "butare", label: "Butare" },
      { value: "gisenyi", label: "Gisenyi" },
      { value: "ruhengeri", label: "Ruhengeri" },
    ],
  },
  {
    value: "ethiopia",
    label: "Ethiopia",
    regions: [
      { value: "addis_ababa", label: "Addis Ababa" },
      { value: "dire_dawa", label: "Dire Dawa" },
      { value: "mekelle", label: "Mekelle" },
      { value: "gondar", label: "Gondar" },
      { value: "hawassa", label: "Hawassa" },
    ],
  },
];

export const DONORS = [
  { id: "d1", name: "World Health Organization", logo: null, code: "WHO" },
  { id: "d2", name: "UNICEF", logo: null, code: "UNICEF" },
  { id: "d3", name: "Bill & Melinda Gates Foundation", logo: null, code: "BMGF" },
  { id: "d4", name: "USAID", logo: null, code: "USAID" },
  { id: "d5", name: "World Bank", logo: null, code: "WB" },
  { id: "d6", name: "African Development Bank", logo: null, code: "AFDB" },
  { id: "d7", name: "European Union", logo: null, code: "EU" },
  { id: "d8", name: "DFID", logo: null, code: "DFID" },
];

export const MANAGERS = [
  { id: "m1", first_name: "John", last_name: "Kariuki", email: "john.kariuki@datastride.com", profile_image: "https://randomuser.me/api/portraits/men/1.jpg", submissions_count: 156 },
  { id: "m2", first_name: "Sarah", last_name: "Mwangi", email: "sarah.mwangi@datastride.com", profile_image: "https://randomuser.me/api/portraits/women/2.jpg", submissions_count: 234 },
  { id: "m3", first_name: "David", last_name: "Ochieng", email: "david.ochieng@datastride.com", profile_image: "https://randomuser.me/api/portraits/men/3.jpg", submissions_count: 189 },
  { id: "m4", first_name: "Grace", last_name: "Wanjiku", email: "grace.wanjiku@datastride.com", profile_image: "https://randomuser.me/api/portraits/women/4.jpg", submissions_count: 278 },
  { id: "m5", first_name: "Peter", last_name: "Kimani", email: "peter.kimani@datastride.com", profile_image: "https://randomuser.me/api/portraits/men/5.jpg", submissions_count: 145 },
  { id: "m6", first_name: "Mary", last_name: "Achieng", email: "mary.achieng@datastride.com", profile_image: "https://randomuser.me/api/portraits/women/6.jpg", submissions_count: 312 },
];

export const FIELD_OFFICERS = [
  { id: "fo1", first_name: "James", last_name: "Mutua", email: "james.mutua@datastride.com", profile_image: "https://randomuser.me/api/portraits/men/11.jpg", submissions_count: 89 },
  { id: "fo2", first_name: "Lucy", last_name: "Wambui", email: "lucy.wambui@datastride.com", profile_image: "https://randomuser.me/api/portraits/women/12.jpg", submissions_count: 112 },
  { id: "fo3", first_name: "Michael", last_name: "Otieno", email: "michael.otieno@datastride.com", profile_image: "https://randomuser.me/api/portraits/men/13.jpg", submissions_count: 76 },
  { id: "fo4", first_name: "Jane", last_name: "Njeri", email: "jane.njeri@datastride.com", profile_image: "https://randomuser.me/api/portraits/women/14.jpg", submissions_count: 98 },
];

export const THEMATIC_AREAS = [
  { value: "health", label: "Health & Nutrition" },
  { value: "education", label: "Education" },
  { value: "agriculture", label: "Agriculture & Food Security" },
  { value: "wash", label: "WASH (Water, Sanitation & Hygiene)" },
  { value: "livelihood", label: "Livelihood & Economic Development" },
  { value: "environment", label: "Environment & Climate" },
  { value: "governance", label: "Governance & Policy" },
  { value: "protection", label: "Protection & Human Rights" },
  { value: "slums_living", label: "Slum's Living" },
];

export const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "swahili", label: "Swahili" },
  { value: "french", label: "French" },
  { value: "arabic", label: "Arabic" },
  { value: "amharic", label: "Amharic" },
];

export const SYNC_METHODS = [
  { value: "auto", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "scheduled", label: "Scheduled" },
];

export const PROJECT_STATUSES = [
  { value: "draft", label: "Draft", color: "#64748b" },
  { value: "active", label: "Active", color: "#22c55e" },
  { value: "on_hold", label: "On Hold", color: "#f59e0b" },
  { value: "completed", label: "Completed", color: "#10b981" },
  { value: "archived", label: "Archived", color: "#94a3b8" },
];

export const FORM_STATUSES = [
  { value: "draft", label: "Draft", color: "#64748b" },
  { value: "published", label: "Published", color: "#22c55e" },
  { value: "closed", label: "Closed", color: "#ef4444" },
];

export const FIELD_TYPES = [
  { type: "text", label: "Text", icon: "Type", category: "basic" },
  { type: "number", label: "Number", icon: "Hash", category: "basic" },
  { type: "email", label: "Email", icon: "Mail", category: "basic" },
  { type: "phone", label: "Phone", icon: "Phone", category: "basic" },
  { type: "textarea", label: "Text Area", icon: "AlignLeft", category: "basic" },
  { type: "date", label: "Date", icon: "Calendar", category: "datetime" },
  { type: "datetime", label: "Date & Time", icon: "CalendarClock", category: "datetime" },
  { type: "time", label: "Time", icon: "Clock", category: "datetime" },
  { type: "select", label: "Dropdown", icon: "ChevronDown", category: "choice" },
  { type: "multi_select", label: "Multi Select", icon: "ListChecks", category: "choice" },
  { type: "radio", label: "Radio Buttons", icon: "Circle", category: "choice" },
  { type: "checkbox", label: "Checkboxes", icon: "CheckSquare", category: "choice" },
  { type: "file", label: "File Upload", icon: "Upload", category: "media" },
  { type: "multi_file", label: "Multi File", icon: "Files", category: "media" },
  { type: "image", label: "Image", icon: "Image", category: "media" },
  { type: "audio", label: "Audio", icon: "Mic", category: "media" },
  { type: "video", label: "Video", icon: "Video", category: "media" },
  { type: "gps", label: "GPS Location", icon: "MapPin", category: "advanced" },
  { type: "signature", label: "Signature", icon: "PenTool", category: "advanced" },
  { type: "barcode", label: "Barcode/QR", icon: "QrCode", category: "advanced" },
  { type: "calculate", label: "Calculate", icon: "Calculator", category: "advanced" },
  { type: "note", label: "Note", icon: "FileText", category: "layout" },
  { type: "hidden", label: "Hidden", icon: "EyeOff", category: "advanced" },
];

export const VALIDATION_TYPES = [
  { type: "required", label: "Required" },
  { type: "min_length", label: "Minimum Length" },
  { type: "max_length", label: "Maximum Length" },
  { type: "min_value", label: "Minimum Value" },
  { type: "max_value", label: "Maximum Value" },
  { type: "pattern", label: "Regex Pattern" },
  { type: "email", label: "Email Format" },
  { type: "phone", label: "Phone Format" },
  { type: "url", label: "URL Format" },
];
