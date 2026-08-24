import {
  CheckSquare,
  Contact,
  Home,
  LayoutDashboard,
  Mail,
  Megaphone,
  Building2,
  Kanban,
  FileText,
  CalendarDays,
} from "lucide-react";

export const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Contacts", href: "/admin/contacts", icon: Contact },
  { label: "Pipeline", href: "/admin/pipeline", icon: Kanban },
  { label: "Tasks", href: "/admin/tasks", icon: CheckSquare },
  { label: "Email", href: "/admin/email", icon: Mail },
  { label: "Campaigns", href: "/admin/email/campaigns", icon: Megaphone },
  { label: "Templates", href: "/admin/email/templates", icon: FileText },
  { label: "Open Houses", href: "/admin/open-houses", icon: CalendarDays },
  { label: "Properties", href: "/admin/properties", icon: Building2 },
] as const;

export const leadStatuses = [
  { id: "new", label: "New" },
  { id: "attempted_contact", label: "Attempted Contact" },
  { id: "contacted", label: "Contacted" },
  { id: "nurture", label: "Nurture" },
  { id: "active_buyer", label: "Active Buyer" },
  { id: "active_seller", label: "Active Seller" },
  { id: "active_renter", label: "Active Renter" },
  { id: "under_contract", label: "Under Contract" },
  { id: "closed", label: "Closed" },
  { id: "lost", label: "Lost / Archived" },
] as const;

export const leadSources = [
  "Open House",
  "Compass",
  "Realtor.com",
  "Website",
  "Referral",
  "Neighbor",
  "Sphere",
  "Social Media",
  "Other",
] as const;
