import { CrmComingSoon } from "@/components/crm/coming-soon";

export const metadata = { title: "Email" };

export default function Page() {
  return (
    <CrmComingSoon
      title="Email"
      description="One-to-one email via Resend with CRM logging and signature."
      phase="Phase 5"
    />
  );
}
