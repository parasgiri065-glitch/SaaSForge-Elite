import type { ReactNode } from "react";
import { parseMarkdown, type BlockNode, type InlineNode } from "@/lib/markdown/parse";

function renderInline(nodes: InlineNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (node.kind) {
      case "text":
        return <span key={key}>{node.value}</span>;
      case "code":
        return (
          <code
            key={key}
            className="rounded bg-zinc-200/80 px-1 py-0.5 font-mono text-[0.85em] dark:bg-zinc-800"
          >
            {node.value}
          </code>
        );
      case "strong":
        return <strong key={key}>{renderInline(node.children, key)}</strong>;
      case "em":
        return <em key={key}>{renderInline(node.children, key)}</em>;
      case "link":
        return (
          <a
            key={key}
            href={node.href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-indigo-400 underline-offset-2"
          >
            {renderInline(node.children, key)}
          </a>
        );
    }
  });
}

function Block({ node, index }: { node: BlockNode; index: number }) {
  switch (node.kind) {
    case "heading": {
      const className = "mt-3 mb-1 font-semibold tracking-tight first:mt-0";
      const children = renderInline(node.children, `h-${index}`);
      if (node.level === 1) {
        return <h1 className={`text-xl ${className}`}>{children}</h1>;
      }
      if (node.level === 2) {
        return <h2 className={`text-lg ${className}`}>{children}</h2>;
      }
      return <h3 className={`text-base ${className}`}>{children}</h3>;
    }
    case "list": {
      const ListTag = node.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={`my-2 space-y-1 pl-5 text-sm ${node.ordered ? "list-decimal" : "list-disc"}`}
        >
          {node.items.map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`}>
              {renderInline(item, `li-${index}-${itemIndex}`)}
            </li>
          ))}
        </ListTag>
      );
    }
    case "code":
      return (
        <pre className="my-2 overflow-x-auto rounded-xl bg-zinc-950 p-3 text-[13px] leading-relaxed text-zinc-100 dark:bg-black">
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
        <p className="my-1.5 text-sm leading-6">
          {renderInline(node.children, `p-${index}`)}
        </p>
      );
  }
}

interface MarkdownStreamProps {
  content: string;
  streaming?: boolean;
}

export function MarkdownStream({ content, streaming = false }: MarkdownStreamProps) {
  const blocks = parseMarkdown(content);

  return (
    <div className="markdown-stream">
      {blocks.map((node, index) => (
        <Block key={`${node.kind}-${index}`} node={node} index={index} />
      ))}
      {streaming ? (
        <span
          className="animate-caret ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-indigo-500 align-middle"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
