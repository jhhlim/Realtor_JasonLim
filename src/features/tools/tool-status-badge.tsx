import { Badge } from "@/components/ui/badge";
import type { ToolStatus } from "@/features/tools/tools-catalog";

const statusConfig: Record<
  ToolStatus,
  { label: string; variant: "success" | "accent" | "warning" }
> = {
  live: { label: "Live", variant: "success" },
  placeholder: { label: "Coming soon", variant: "warning" },
};

export function ToolStatusBadge({
  status,
  category,
}: {
  status: ToolStatus;
  category?: string;
}) {
  if (category === "AI" && status === "live") {
    return <Badge variant="accent">AI powered</Badge>;
  }
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
