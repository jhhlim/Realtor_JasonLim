import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { SchoolComparisonTool } from "@/features/tools/school-comparison-tool";
import { ToolPageShell } from "@/features/tools/tool-page-shell";

export const metadata: Metadata = {
  title: `School Comparison | ${siteConfig.name}`,
  description: "Placeholder school comparison UI for Bay Area districts and campuses.",
};

export default function SchoolComparisonPage() {
  return (
    <ToolPageShell
      title="School comparison"
      description="Explore a placeholder side-by-side for high schools buyers often weigh — live data integrations coming next."
    >
      <SchoolComparisonTool />
    </ToolPageShell>
  );
}
