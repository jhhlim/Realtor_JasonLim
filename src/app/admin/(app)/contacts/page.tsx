import { CrmComingSoon } from "@/components/crm/coming-soon";

export const metadata = { title: "Contacts" };

export default function AdminContactsPage() {
  return (
    <CrmComingSoon
      title="Contacts"
      description="Searchable contact database with status, source, tags, and follow-ups."
      phase="Phase 2"
    />
  );
}
