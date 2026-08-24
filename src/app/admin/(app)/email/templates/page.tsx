import { CrmComingSoon } from "@/components/crm/coming-soon";

export const metadata = { title: "Templates" };

export default function Page() {
  return (
    <CrmComingSoon
      title="Email templates"
      description="Open house, buyer follow-up, and market update templates with variables."
      phase="Phase 5"
    />
  );
}
