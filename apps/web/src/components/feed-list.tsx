"use client";

import { useCallback, useEffect, useState } from "react";
import { api, Opportunity } from "@/lib/api";
import { TIPOS, TIPO_LABELS } from "@academic-pinpoint/shared";
import { OpportunityCard } from "./opportunity-card";
import { SearchIcon } from "./icons";

const CHIPS: { value: string; label: string }[] = [
  { value: "", label: "Todos" },
  ...TIPOS.map((t) => ({ value: t, label: `${TIPO_LABELS[t]}s` })),
];

export function FeedList({ personalizado }: { personalizado: boolean }) {
  const [tipo, setTipo] = useState("");
  const [busca, setBusca] = useState("");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Opportunity[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const load = useCallback(
    async (nextPage: number, append: boolean) => {
      setLoading(true);
      setErro(null);
      try {
        const res = await api.opportunities({
          tipo: tipo || undefined,
          q: q || undefined,
          page: nextPage,
          personalizado,
        });
        setItems((prev) => (append ? [...prev, ...res.items] : res.items));
        setTotal(res.total);
        setPage(res.page);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao carregar o feed");
      } finally {
        setLoading(false);
      }
    },
    [tipo, q, personalizado],
  );

  useEffect(() => {
    load(1, false);
  }, [load]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQ(busca.trim());
        }}
        className="relative"
      >
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar oportunidades..."
          className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm outline-none focus:border-navy-600"
        />
      </form>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {CHIPS.map((chip) => (
          <button
            key={chip.value}
            onClick={() => setTipo(chip.value)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tipo === chip.value
                ? "bg-navy-700 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-navy-600"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {erro && (
          <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{erro}</p>
        )}
        {!erro && !loading && items.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
            Nenhuma oportunidade encontrada.
            {personalizado && (
              <span className="block pt-1">
                Tente ajustar seus filtros ou suas áreas de interesse em
                Configurações.
              </span>
            )}
          </div>
        )}
        {items.map((o) => (
          <OpportunityCard key={o.id} opportunity={o} />
        ))}
      </div>

      {loading && (
        <p className="py-6 text-center text-sm text-slate-400">Carregando…</p>
      )}
      {!loading && items.length < total && (
        <button
          onClick={() => load(page + 1, true)}
          className="mt-4 w-full rounded-full border border-navy-600 py-2.5 text-sm font-semibold text-navy-700 transition hover:bg-navy-50"
        >
          Carregar mais
        </button>
      )}
    </div>
  );
}
