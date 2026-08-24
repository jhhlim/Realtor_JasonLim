import { CrmComingSoon } from "@/components/crm/coming-soon";

export const metadata = { title: "Campaigns" };

export default function Page() {
  return (
    <CrmComingSoon
      title="Bulk email campaigns"
      description="Segment by tag, status, city, and source — with preview and confirmation."
      phase="Phase 6"
    />
  );
}
