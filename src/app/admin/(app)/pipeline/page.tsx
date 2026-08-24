import { CrmComingSoon } from "@/components/crm/coming-soon";

export const metadata = { title: "Pipeline" };

export default function Page() {
  return (
    <CrmComingSoon
      title="Pipeline"
      description="Buyer and seller Kanban boards with drag-and-drop stages."
      phase="Phase 4"
    />
  );
}
