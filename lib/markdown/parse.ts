export type InlineNode =
  | { kind: "text"; value: string }
  | { kind: "code"; value: string }
  | { kind: "strong"; children: InlineNode[] }
  | { kind: "em"; children: InlineNode[] }
  | { kind: "link"; href: string; children: InlineNode[] };

export type BlockNode =
  | { kind: "paragraph"; children: InlineNode[] }
  | { kind: "heading"; level: 1 | 2 | 3; children: InlineNode[] }
  | { kind: "list"; ordered: boolean; items: InlineNode[][] }
  | { kind: "code"; language: string; value: string; incomplete: boolean };

const SAFE_HREF = /^(https?:\/\/|mailto:|\/)/i;

function parseInline(input: string): InlineNode[] {
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
      nodes.push({ kind: "strong", children: parseInline(strong[1]) });
      remaining = remaining.slice(strong[0].length);
      continue;
    }

    const em = remaining.match(/^_([^_]+)_/) ?? remaining.match(/^\*([^*]+)\*/);
    if (em?.[1] !== undefined) {
      nodes.push({ kind: "em", children: parseInline(em[1]) });
      remaining = remaining.slice(em[0].length);
      continue;
    }

    const link = remaining.match(/^\[([^\]]+)\]\(([^)\s]+)\)/);
    if (link?.[1] !== undefined && link[2] !== undefined && SAFE_HREF.test(link[2])) {
      nodes.push({
        kind: "link",
        href: link[2],
        children: parseInline(link[1]),
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

function headingLevel(marker: string): 1 | 2 | 3 {
  if (marker.length >= 3) {
    return 3;
  }
  if (marker.length === 2) {
    return 2;
  }
  return 1;
}

/**
 * Small, streaming-safe markdown subset.
 * Incomplete fences stay as an open code block instead of leaking raw ticks.
 */
export function parseMarkdown(source: string): BlockNode[] {
  const blocks: BlockNode[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const body: string[] = [];
      index += 1;
      let closed = false;
      while (index < lines.length) {
        const next = lines[index] ?? "";
        if (next.startsWith("```")) {
          closed = true;
          index += 1;
          break;
        }
        body.push(next);
        index += 1;
      }
      blocks.push({
        kind: "code",
        language,
        value: body.join("\n"),
        incomplete: !closed,
      });
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading?.[1] && heading[2]) {
      blocks.push({
        kind: "heading",
        level: headingLevel(heading[1]),
        children: parseInline(heading[2]),
      });
      index += 1;
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (unordered?.[1] !== undefined) {
      const items: InlineNode[][] = [parseInline(unordered[1])];
      index += 1;
      while (index < lines.length) {
        const item = (lines[index] ?? "").match(/^[-*]\s+(.+)$/);
        if (!item?.[1]) {
          break;
        }
        items.push(parseInline(item[1]));
        index += 1;
      }
      blocks.push({ kind: "list", ordered: false, items });
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered?.[1] !== undefined) {
      const items: InlineNode[][] = [parseInline(ordered[1])];
      index += 1;
      while (index < lines.length) {
        const item = (lines[index] ?? "").match(/^\d+\.\s+(.+)$/);
        if (!item?.[1]) {
          break;
        }
        items.push(parseInline(item[1]));
        index += 1;
      }
      blocks.push({ kind: "list", ordered: true, items });
      continue;
    }

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length) {
      const next = lines[index] ?? "";
      if (
        next.trim() === "" ||
        next.startsWith("```") ||
        /^#{1,3}\s+/.test(next) ||
        /^[-*]\s+/.test(next) ||
        /^\d+\.\s+/.test(next)
      ) {
        break;
      }
      paragraph.push(next);
      index += 1;
    }
    blocks.push({
      kind: "paragraph",
      children: parseInline(paragraph.join(" ")),
    });
  }

  return blocks;
}
