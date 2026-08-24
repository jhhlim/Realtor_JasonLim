import { CrmComingSoon } from "@/components/crm/coming-soon";

export const metadata = { title: "Open Houses" };

export default function Page() {
  return (
    <CrmComingSoon
      title="Open houses"
      description="Schedule open houses and capture visitors as CRM leads in under 30 seconds."
      phase="Phase 4"
    />
  );
}
