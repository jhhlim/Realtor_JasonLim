import type { ReactNode } from "react";

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; intro?: string; items: string[] };

const BULLET_RE = /^\s*[•\-\*]\s+/;

function parseBlock(raw: string): Block {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const bulletIndexes = lines
    .map((line, i) => (BULLET_RE.test(line) ? i : -1))
    .filter((i) => i >= 0);

  if (bulletIndexes.length === 0) {
    return { type: "p", text: lines.join(" ") };
  }

  const firstBullet = bulletIndexes[0]!;
  const introLines = lines.slice(0, firstBullet);
  const items = lines
    .slice(firstBullet)
    .filter((line) => BULLET_RE.test(line))
    .map((line) => line.replace(BULLET_RE, "").trim());

  return {
    type: "ul",
    intro: introLines.length ? introLines.join(" ") : undefined,
    items,
  };
}

function parseContent(content: string): Block[] {
  return content
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(parseBlock);
}

export function BlogContent({ content }: { content: string }) {
  const blocks = parseContent(content);

  return (
    <div className="space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={`p-${index}`}>{block.text}</p>;
        }

        const nodes: ReactNode[] = [];
        if (block.intro) {
          nodes.push(
            <p key={`intro-${index}`} className="mb-3">
              {block.intro}
            </p>,
          );
        }
        nodes.push(
          <ul
            key={`ul-${index}`}
            className="list-disc space-y-2 pl-6 marker:text-accent"
          >
            {block.items.map((item) => (
              <li key={item.slice(0, 48)}>{item}</li>
            ))}
          </ul>,
        );

        return (
          <div key={`block-${index}`} className="space-y-0">
            {nodes}
          </div>
        );
      })}
    </div>
  );
}
