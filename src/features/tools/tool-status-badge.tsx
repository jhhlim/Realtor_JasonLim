import { Badge } from "@/components/ui/badge";
import type { ToolStatus } from "@/features/tools/tools-catalog";

const statusConfig: Record<
  ToolStatus,
  { label: string; variant: "success" | "accent" | "warning" }
> = {
  live: { label: "Live", variant: "success" },
  "ai-stub": { label: "AI preview", variant: "accent" },
  placeholder: { label: "Coming soon", variant: "warning" },
};

export function ToolStatusBadge({ status }: { status: ToolStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
