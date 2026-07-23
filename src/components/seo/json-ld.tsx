import type { JsonLd } from "@/lib/schema";

interface JsonLdProps {
  data: JsonLd | JsonLd[];
  id?: string;
}

/**
 * Renders a JSON-LD script tag for structured data.
 */
export function JsonLdScript({ data, id }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload.length === 1 ? payload[0] : payload),
      }}
    />
  );
}
