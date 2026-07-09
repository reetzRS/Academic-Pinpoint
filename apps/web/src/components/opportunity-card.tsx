"use client";

import Link from "next/link";
import { useState } from "react";
import { api, Opportunity } from "@/lib/api";
import { daysLeft, formatDate, TIPO_BADGE } from "@/lib/format";
import { TIPO_LABELS } from "@academic-pinpoint/shared";
import { BookmarkIcon, CalendarIcon, PinIcon } from "./icons";

export function TipoBadge({ tipo }: { tipo: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
        TIPO_BADGE[tipo] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {TIPO_LABELS[tipo as keyof typeof TIPO_LABELS] ?? tipo}
    </span>
  );
}

export function SaveButton({
  opportunity,
  className = "",
}: {
  opportunity: Opportunity;
  className?: string;
}) {
  const [salvo, setSalvo] = useState(opportunity.salvo);
  const [busy, setBusy] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const res = salvo
        ? await api.unsave(opportunity.id)
        : await api.save(opportunity.id);
      setSalvo(res.salvo);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={salvo ? "Remover dos salvos" : "Salvar oportunidade"}
      className={`rounded-full p-1.5 transition hover:bg-navy-50 ${
        salvo ? "text-gold-500" : "text-slate-400"
      } ${className}`}
    >
      <BookmarkIcon className="h-5 w-5" filled={salvo} />
    </button>
  );
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const dias = daysLeft(opportunity.prazoInscricao);
  return (
    <Link
      href={`/oportunidade/${opportunity.id}`}
      className="block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <TipoBadge tipo={opportunity.tipo} />
        <SaveButton opportunity={opportunity} />
      </div>
      <h3 className="mt-2 font-bold text-navy-800">{opportunity.titulo}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
        {opportunity.descricao}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4" />
          {formatDate(opportunity.prazoInscricao)}
          {dias !== null && dias >= 0 && dias <= 7 && (
            <span className="font-semibold text-rose-600">
              ({dias === 0 ? "último dia" : `${dias} dias`})
            </span>
          )}
        </span>
        {opportunity.local && (
          <span className="flex items-center gap-1.5">
            <PinIcon className="h-4 w-4" />
            {opportunity.local}
          </span>
        )}
      </div>
    </Link>
  );
}
