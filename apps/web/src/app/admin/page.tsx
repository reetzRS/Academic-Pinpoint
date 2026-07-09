"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, ApiError, Opportunity } from "@/lib/api";
import { TipoBadge } from "@/components/opportunity-card";
import { formatDate } from "@/lib/format";

export default function AdminPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api
      .opportunities({ apenasAbertas: false, pageSize: 50 })
      .then((res) => setItems(res.items))
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, []);

  const remover = async (id: string) => {
    if (!confirm("Remover esta oportunidade?")) return;
    try {
      await api.adminDelete(id);
      setItems((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Erro ao remover");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-800">Gestão de oportunidades</h1>
        <Link
          href="/admin/nova"
          className="rounded-full bg-navy-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-600"
        >
          Nova oportunidade
        </Link>
      </div>

      {loading && (
        <p className="py-6 text-center text-sm text-slate-400">Carregando…</p>
      )}

      {!loading && erro && (
        <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{erro}</p>
      )}

      {!loading && !erro && items.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
          Nenhuma oportunidade cadastrada.
        </div>
      )}

      {!loading && !erro && items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {items.map((o, i) => (
            <div
              key={o.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                i > 0 ? "border-t border-slate-100" : ""
              }`}
            >
              <div className="shrink-0">
                <TipoBadge tipo={o.tipo} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy-800">
                  {o.titulo}
                </p>
                <p className="text-xs text-slate-400">
                  {formatDate(o.prazoInscricao)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/${o.id}/editar`}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-50"
                >
                  Editar
                </Link>
                <button
                  onClick={() => remover(o.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
