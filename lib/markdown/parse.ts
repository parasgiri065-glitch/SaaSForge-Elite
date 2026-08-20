import { parseInlineMarkdown } from "@/lib/markdown/parse-inline";
import type { BlockNode, InlineNode } from "@/lib/markdown/types";

export type { BlockNode, InlineNode };

/**
 * Map a `#` run to a heading level capped at 3.
 *
 * @param marker - The leading `#` characters from a heading line.
 * @returns `1`, `2`, or `3`.
 */
function headingLevelFromMarker(marker: string): 1 | 2 | 3 {
  if (marker.length >= 3) {
    return 3;
  }
  if (marker.length === 2) {
    return 2;
  }
  return 1;
}

/**
 * Parse a streaming-safe markdown subset into block nodes.
 * Incomplete fences stay as an open code block instead of leaking raw ticks.
 *
 * @param source - The full assistant buffer so far (may be mid-token).
 * @returns Ordered block nodes for `MarkdownStream`.
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
        level: headingLevelFromMarker(heading[1]),
        children: parseInlineMarkdown(heading[2]),
      });
      index += 1;
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (unordered?.[1] !== undefined) {
      const items: InlineNode[][] = [parseInlineMarkdown(unordered[1])];
      index += 1;
      while (index < lines.length) {
        const item = (lines[index] ?? "").match(/^[-*]\s+(.+)$/);
        if (!item?.[1]) {
          break;
        }
        items.push(parseInlineMarkdown(item[1]));
        index += 1;
      }
      blocks.push({ kind: "list", ordered: false, items });
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered?.[1] !== undefined) {
      const items: InlineNode[][] = [parseInlineMarkdown(ordered[1])];
      index += 1;
      while (index < lines.length) {
        const item = (lines[index] ?? "").match(/^\d+\.\s+(.+)$/);
        if (!item?.[1]) {
          break;
        }
        items.push(parseInlineMarkdown(item[1]));
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
      children: parseInlineMarkdown(paragraph.join(" ")),
    });
  }

  return blocks;
}
