import type { ReactNode } from "react";
import { parseMarkdown, type BlockNode, type InlineNode } from "@/lib/markdown/parse";
import { cn } from "@/lib/ui/cn";
import { markdownClasses } from "@/lib/ui/layout-classes";

/**
 * Render a list of inline markdown nodes.
 *
 * @param nodes - Inline AST from `parseInlineMarkdown`.
 * @param keyPrefix - React key prefix unique to the parent block.
 * @returns React children for a heading, paragraph, or list item.
 */
function renderInlineNodes(nodes: InlineNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (node.kind) {
      case "text":
        return <span key={key}>{node.value}</span>;
      case "code":
        return (
          <code key={key} className={markdownClasses.inlineCode}>
            {node.value}
          </code>
        );
      case "strong":
        return <strong key={key}>{renderInlineNodes(node.children, key)}</strong>;
      case "em":
        return <em key={key}>{renderInlineNodes(node.children, key)}</em>;
      case "link":
        return (
          <a
            key={key}
            href={node.href}
            target="_blank"
            rel="noreferrer"
            className={markdownClasses.link}
          >
            {renderInlineNodes(node.children, key)}
          </a>
        );
    }
  });
}

/**
 * Render one markdown block node.
 *
 * @param props.node - Block AST node.
 * @param props.index - Position in the block list (used for keys).
 * @returns A heading, list, code block, or paragraph.
 */
function MarkdownBlock({ node, index }: { node: BlockNode; index: number }) {
  switch (node.kind) {
    case "heading": {
      const children = renderInlineNodes(node.children, `h-${index}`);
      if (node.level === 1) {
        return <h1 className={cn("text-xl", markdownClasses.heading)}>{children}</h1>;
      }
      if (node.level === 2) {
        return <h2 className={cn("text-lg", markdownClasses.heading)}>{children}</h2>;
      }
      return <h3 className={cn("text-base", markdownClasses.heading)}>{children}</h3>;
    }
    case "list": {
      const ListTag = node.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={cn(
            "my-2 space-y-1 pl-5 text-sm",
            node.ordered ? "list-decimal" : "list-disc",
          )}
        >
          {node.items.map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`}>
              {renderInlineNodes(item, `li-${index}-${itemIndex}`)}
            </li>
          ))}
        </ListTag>
      );
    }
    case "code":
      return (
        <pre className={markdownClasses.codeBlock}>
          {node.language ? (
            <span className="mb-2 block text-[10px] tracking-wide text-zinc-400 uppercase">
              {node.language}
              {node.incomplete ? " · streaming" : ""}
            </span>
          ) : null}
          <code>{node.value}</code>
        </pre>
      );
    case "paragraph":
      return (
        <p className={markdownClasses.paragraph}>
          {renderInlineNodes(node.children, `p-${index}`)}
        </p>
      );
  }
}

interface MarkdownStreamProps {
  content: string;
  streaming?: boolean;
}

/**
 * Streaming-safe markdown renderer for assistant bubbles.
 *
 * @param props.content - Full buffer so far (may be mid-token).
 * @param props.streaming - When true, shows a caret after the last block.
 * @returns A `div.markdown-stream` of rendered blocks.
 */
export function MarkdownStream({ content, streaming = false }: MarkdownStreamProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className="markdown-stream">
      {blocks.map((node, index) => (
        <MarkdownBlock key={`${node.kind}-${index}`} node={node} index={index} />
      ))}
      {streaming ? <span className={markdownClasses.caret} aria-hidden /> : null}
    </div>
  );
}
