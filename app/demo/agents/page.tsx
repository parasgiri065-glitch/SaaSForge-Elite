import type { Metadata } from "next";
import { ChatViewport } from "@/components/agents/chat-viewport";

export const metadata: Metadata = {
  title: "Demo AI agent",
  robots: { index: false, follow: false },
};

export default function DemoAgentsPage() {
  return <ChatViewport />;
}
