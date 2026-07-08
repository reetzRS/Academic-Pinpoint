"use client";

import { AppShell } from "@/components/app-shell";
import { FeedList } from "@/components/feed-list";

export default function FeedPage() {
  return (
    <AppShell>
      <h1 className="mb-4 text-xl font-bold text-navy-800">
        Oportunidades para você
      </h1>
      <FeedList personalizado />
    </AppShell>
  );
}
