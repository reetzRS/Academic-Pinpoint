"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, Opportunity } from "@/lib/api";
import { daysLeft, formatDate } from "@/lib/format";
import { MODALIDADE_LABELS, TIPO_LABELS } from "@academic-pinpoint/shared";
import { AppShell } from "@/components/app-shell";
import { SaveButton } from "@/components/opportunity-card";
import { OpportunityDetailSkeleton } from "@/components/skeletons";
import { ExternalIcon } from "@/components/icons";

export default function OportunidadePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api
      .opportunity(id)
      .then(setOpp)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro"));
  }, [id]);

  const dias = daysLeft(opp?.prazoInscricao);

  return (
    <AppShell>
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm font-medium text-navy-700 hover:underline"
      >
        ← Voltar para oportunidades
      </button>

      {erro && (
        <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{erro}</p>
      )}

      {!opp && !erro && <OpportunityDetailSkeleton />}

      {opp && (
        <article>
          <header className="rounded-2xl bg-navy-800 p-6 text-center md:p-10">
            <span className="inline-block rounded-full bg-gold-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy-900">
              {TIPO_LABELS[opp.tipo as keyof typeof TIPO_LABELS] ?? opp.tipo}
              {opp.fonte !== "demo" ? ` · ${opp.fonte}` : ""}
            </span>
            <h1 className="mx-auto mt-3 max-w-xl text-2xl font-extrabold text-white md:text-3xl">
              {opp.titulo}
            </h1>
            {dias !== null && dias >= 0 && (
              <p className="mt-2 text-sm text-navy-100">
                {dias === 0
                  ? "Último dia de inscrição!"
                  : `Faltam ${dias} dias para o fim das inscrições`}
              </p>
            )}
          </header>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
              <p className="text-[11px] font-bold uppercase text-slate-400">Prazo</p>
              <p className="mt-1 text-sm font-bold text-navy-800">
                {formatDate(opp.prazoInscricao)}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
              <p className="text-[11px] font-bold uppercase text-slate-400">
                Modalidade
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-600">
                {opp.modalidade
                  ? (MODALIDADE_LABELS[
                      opp.modalidade as keyof typeof MODALIDADE_LABELS
                    ] ?? opp.modalidade)
                  : "—"}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
              <p className="text-[11px] font-bold uppercase text-slate-400">Bolsa</p>
              <p className="mt-1 text-sm font-bold text-navy-800">
                {opp.valorBolsa ?? "—"}
              </p>
            </div>
          </div>

          <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <h2 className="font-bold text-navy-800">Sobre a Oportunidade</h2>
              <SaveButton opportunity={opp} />
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {opp.descricao}
            </p>
          </section>

          {opp.requisitos.length > 0 && (
            <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="font-bold text-navy-800">Requisitos</h2>
              <ul className="mt-2 space-y-2">
                {opp.requisitos.map((req) => (
                  <li key={req} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {opp.instituicao && (
            <section className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-50 text-lg">
                🏛️
              </span>
              <div>
                <p className="font-bold text-navy-800">{opp.instituicao}</p>
                {opp.local && (
                  <p className="text-sm text-slate-500">{opp.local}</p>
                )}
              </div>
            </section>
          )}

          <a
            href={opp.urlOrigem}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-navy-700 py-3.5 font-semibold text-white transition hover:bg-navy-600"
          >
            <ExternalIcon className="h-5 w-5" />
            Candidatar-se Agora
          </a>
          <p className="mt-2 text-center text-xs text-slate-400">
            Você será redirecionado(a) para a página oficial da oportunidade.
          </p>
        </article>
      )}
    </AppShell>
  );
}
