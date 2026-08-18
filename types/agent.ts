export type ChatRole = "user" | "assistant" | "system";

export type ChatMessageStatus = "complete" | "streaming" | "error";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  status: ChatMessageStatus;
};

export type AgentStreamEvent =
  { type: "delta"; text: string } | { type: "done" } | { type: "error"; message: string };
