export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName:
    | "LayoutGrid"
    | "Smartphone"
    | "Palette"
    | "FileText"
    | "Sparkles"
    | "Calendar"
    | "Users"
    | "CreditCard"
    | "Home"
    | "Bell"
    | "ShieldCheck"
    | "Activity"
    | "Settings";
  description: string;
  implemented: boolean;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    iconName: "LayoutGrid",
    description: "Main workspace overview, key metrics, platform activity, and system status.",
    implemented: true,
  },
  {
    id: "app-screens",
    label: "App Screens",
    href: "/admin/app-screens",
    iconName: "Smartphone",
    description: "Preview and manage end-user web and mobile application screens.",
    implemented: true,
  },
  {
    id: "design-system",
    label: "Design System",
    href: "/admin/design-system",
    iconName: "Palette",
    description: "Manage visual foundations, brand assets, color tokens, and typography specifications.",
    implemented: true,
  },
  {
    id: "templates",
    label: "Templates",
    href: "/admin/templates",
    iconName: "FileText",
    description: "Browse, create, and publish editable poster, flyer, and social media templates.",
    implemented: true,
  },
  {
    id: "ai-generation",
    label: "AI Image Generation",
    href: "/admin/ai-generation",
    iconName: "Sparkles",
    description: "Manage generative AI models, prompt styles, aspect ratios, and generation queues.",
    implemented: false,
  },
  {
    id: "festivals",
    label: "Festivals & Events",
    href: "/admin/festivals",
    iconName: "Calendar",
    description: "Schedule festival campaigns, seasonal occasions, and promotional event dates.",
    implemented: false,
  },
  {
    id: "users",
    label: "Users",
    href: "/admin/users",
    iconName: "Users",
    description: "Search, verify, and manage platform members, admin roles, and account permissions.",
    implemented: false,
  },
  {
    id: "subscriptions",
    label: "Subscriptions & Payments",
    href: "/admin/subscriptions",
    iconName: "CreditCard",
    description: "Manage recurring subscription tiers, billing cycles, transactions, and invoices.",
    implemented: false,
  },
  {
    id: "home-content",
    label: "Home Content",
    href: "/admin/home-content",
    iconName: "Home",
    description: "Curate featured posters, hero banners, and promotional content on the client app.",
    implemented: false,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/admin/notifications",
    iconName: "Bell",
    description: "Send push alerts, broadcast system announcements, and review notification logs.",
    implemented: false,
  },
  {
    id: "roles",
    label: "Roles & Permissions",
    href: "/admin/roles",
    iconName: "ShieldCheck",
    description: "Manage role-based access controls (RBAC) and administrative audit policies.",
    implemented: false,
  },
  {
    id: "system-health",
    label: "System Health",
    href: "/admin/system-health",
    iconName: "Activity",
    description: "Inspect database connections, AI service latency, and operational health metrics.",
    implemented: false,
  },
  {
    id: "settings",
    label: "Support & Settings",
    href: "/admin/settings",
    iconName: "Settings",
    description: "Configure workspace settings, API credentials, and administrative preferences.",
    implemented: false,
  },
];
