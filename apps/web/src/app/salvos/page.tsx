"use client";

import { useEffect, useState } from "react";
import { api, Opportunity } from "@/lib/api";
import { AppShell } from "@/components/app-shell";
import { OpportunityCard } from "@/components/opportunity-card";
import { CardSkeleton } from "@/components/skeletons";

export default function SalvosPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .saved()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <h1 className="mb-4 text-xl font-bold text-navy-800">
        Oportunidades salvas
      </h1>
      {loading && (
        <div className="flex flex-col gap-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
          Você ainda não salvou nenhuma oportunidade.
          <span className="block pt-1">
            Toque no marcador de um card para guardá-lo aqui.
          </span>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {items.map((o) => (
          <OpportunityCard key={o.id} opportunity={o} />
        ))}
      </div>
    </AppShell>
  );
}
