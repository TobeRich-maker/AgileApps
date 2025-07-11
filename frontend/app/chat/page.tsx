"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { ChatPanel } from "@/components/chat/chat-panel";

export default function ChatPage() {
  return (
    <MainLayout>
      <div className="h-[calc(100vh-120px)]">
        <ChatPanel />
      </div>
    </MainLayout>
  );
}
