import type { Metadata } from "next";
import { ChatViewport } from "@/components/agents/chat-viewport";

export const metadata: Metadata = {
  title: "Agent session",
  robots: { index: false, follow: false },
};

export default async function AgentSessionPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  return <ChatViewport agentId={agentId} />;
}
