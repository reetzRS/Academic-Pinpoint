"use client";

import { AppShell } from "@/components/app-shell";
import { FeedList } from "@/components/feed-list";

export default function ExplorarPage() {
  return (
    <AppShell>
      <h1 className="mb-1 text-xl font-bold text-navy-800">Explorar</h1>
      <p className="mb-4 text-sm text-slate-500">
        Todas as oportunidades, sem filtro de preferências.
      </p>
      <FeedList personalizado={false} />
    </AppShell>
  );
}
