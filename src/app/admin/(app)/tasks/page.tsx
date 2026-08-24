import { CrmComingSoon } from "@/components/crm/coming-soon";

export const metadata = { title: "Tasks" };

export default function Page() {
  return (
    <CrmComingSoon
      title="Tasks"
      description="Today, upcoming, overdue, and completed follow-up tasks."
      phase="Phase 3"
    />
  );
}
