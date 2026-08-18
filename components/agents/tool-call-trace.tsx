interface ToolCall {
  name: string;
  status: "running" | "done";
  detail: string;
}

interface ToolCallTraceProps {
  calls: ToolCall[];
}

export function ToolCallTrace({ calls }: ToolCallTraceProps) {
  if (calls.length === 0) {
    return null;
  }

  return (
    <ol className="space-y-2 text-xs">
      {calls.map((call) => (
        <li
          key={`${call.name}-${call.detail}`}
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <span className="font-medium">{call.name}</span>
          <span className="mx-2 text-zinc-400">{call.status}</span>
          <span className="text-zinc-500">{call.detail}</span>
        </li>
      ))}
    </ol>
  );
}
