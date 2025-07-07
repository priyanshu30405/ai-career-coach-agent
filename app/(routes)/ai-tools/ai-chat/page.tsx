"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AiChatRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to a new chat (or a default chat id)
    router.replace("/ai-tools/ai-chat/new");
  }, [router]);
  return null;
} 