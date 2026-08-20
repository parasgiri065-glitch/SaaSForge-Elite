import { describe, expect, it } from "vitest";
import { parseMarkdown } from "@/lib/markdown/parse";
import { parseInlineMarkdown } from "@/lib/markdown/parse-inline";

describe("parseInlineMarkdown", () => {
  it("parses strong, emphasis, code, and safe links", () => {
    const nodes = parseInlineMarkdown("**Hi** _there_ `x` [docs](https://example.com)");
    expect(nodes.map((node) => node.kind)).toEqual([
      "strong",
      "text",
      "em",
      "text",
      "code",
      "text",
      "link",
    ]);
  });

  it("leaves unsafe hrefs as literal text", () => {
    const nodes = parseInlineMarkdown("[x](javascript:alert(1))");
    expect(nodes[0]?.kind).toBe("text");
  });
});

describe("parseMarkdown", () => {
  it("parses headings, lists, and paragraphs", () => {
    const blocks = parseMarkdown("# Title\n\n- one\n- two\n\nHello");
    expect(blocks[0]).toMatchObject({ kind: "heading", level: 1 });
    expect(blocks[1]).toMatchObject({ kind: "list", ordered: false });
    expect(blocks[2]).toMatchObject({ kind: "paragraph" });
  });

  it("keeps an incomplete fence as an open code block", () => {
    const blocks = parseMarkdown("```ts\nconst x = 1;");
    expect(blocks).toEqual([
      { kind: "code", language: "ts", value: "const x = 1;", incomplete: true },
    ]);
  });
});
