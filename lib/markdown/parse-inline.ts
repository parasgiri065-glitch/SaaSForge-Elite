import type { InlineNode } from "@/lib/markdown/types";

const SAFE_HREF = /^(https?:\/\/|mailto:|\/)/i;

/**
 * Parse a streaming-safe inline markdown subset (code, strong, em, links).
 * Unknown or unsafe link hrefs are left as literal text.
 *
 * @param input - A single paragraph, heading, or list-item string.
 * @returns An ordered list of inline nodes for the renderer.
 */
export function parseInlineMarkdown(input: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let remaining = input;

  while (remaining.length > 0) {
    const code = remaining.match(/^`([^`]+)`/);
    if (code?.[1] !== undefined) {
      nodes.push({ kind: "code", value: code[1] });
      remaining = remaining.slice(code[0].length);
      continue;
    }

    const strong = remaining.match(/^\*\*([^*]+)\*\*/);
    if (strong?.[1] !== undefined) {
      nodes.push({ kind: "strong", children: parseInlineMarkdown(strong[1]) });
      remaining = remaining.slice(strong[0].length);
      continue;
    }

    const em = remaining.match(/^_([^_]+)_/) ?? remaining.match(/^\*([^*]+)\*/);
    if (em?.[1] !== undefined) {
      nodes.push({ kind: "em", children: parseInlineMarkdown(em[1]) });
      remaining = remaining.slice(em[0].length);
      continue;
    }

    const link = remaining.match(/^\[([^\]]+)\]\(([^)\s]+)\)/);
    if (link?.[1] !== undefined && link[2] !== undefined && SAFE_HREF.test(link[2])) {
      nodes.push({
        kind: "link",
        href: link[2],
        children: parseInlineMarkdown(link[1]),
      });
      remaining = remaining.slice(link[0].length);
      continue;
    }

    const nextSpecial = remaining.search(/[`*_[]/);
    if (nextSpecial === -1) {
      nodes.push({ kind: "text", value: remaining });
      break;
    }
    if (nextSpecial === 0) {
      nodes.push({ kind: "text", value: remaining[0] ?? "" });
      remaining = remaining.slice(1);
      continue;
    }
    nodes.push({ kind: "text", value: remaining.slice(0, nextSpecial) });
    remaining = remaining.slice(nextSpecial);
  }

  return nodes;
}
