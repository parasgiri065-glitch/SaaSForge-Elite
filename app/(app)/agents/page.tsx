import type { Metadata } from "next";
import { ChatViewport } from "@/components/agents/chat-viewport";

export const metadata: Metadata = {
  title: "AI Agent",
  robots: { index: false, follow: false },
};

export default function AgentsPage() {
  return <ChatViewport />;
}
