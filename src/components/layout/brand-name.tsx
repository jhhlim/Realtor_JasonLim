import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Agent display name that swaps with language:
 * EN / 日本語 → Jason Lim | 简体 → 林辉鸿 | 繁體 → 林輝鴻
 *
 * Always marked notranslate so Google Translate never phonetically
 * transliterates the English name. Visibility is driven by
 * `html[data-site-lang]` (set before paint + on language toggle).
 */
export function BrandName({
  className,
  block = false,
}: {
  className?: string;
  /** Stack Chinese name on its own line (hero headline). */
  block?: boolean;
}) {
  return (
    <span className={cn("brand-name", block && "brand-name-block", className)}>
      <span className="notranslate brand-name-en">{siteConfig.name}</span>
      <span className="notranslate brand-name-zh-cn">{siteConfig.nameZhCN}</span>
      <span className="notranslate brand-name-zh-tw">{siteConfig.nameZhTW}</span>
    </span>
  );
}
