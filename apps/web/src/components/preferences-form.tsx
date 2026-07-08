"use client";

import { useState } from "react";
import {
  AREAS,
  AREA_LABELS,
  TIPOS,
  TIPO_LABELS,
} from "@academic-pinpoint/shared";
import { AREA_ICONS } from "@/lib/format";

export function PreferencesForm({
  initialAreas = [],
  initialTipos = [],
  submitLabel,
  onSubmit,
}: {
  initialAreas?: string[];
  initialTipos?: string[];
  submitLabel: string;
  onSubmit: (areas: string[], tipos: string[]) => Promise<void>;
}) {
  const [areas, setAreas] = useState<string[]>(initialAreas);
  const [tipos, setTipos] = useState<string[]>(initialTipos);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const submit = async () => {
    setBusy(true);
    setErro(null);
    try {
      await onSubmit(areas, tipos);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar preferências");
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-navy-700">
        Áreas de interesse
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {AREAS.map((area) => {
          const active = areas.includes(area);
          return (
            <button
              key={area}
              type="button"
              onClick={() => setAreas((a) => toggle(a, area))}
              className={`relative rounded-2xl border-2 bg-white p-4 text-center transition ${
                active
                  ? "border-navy-700 shadow-sm"
                  : "border-slate-200 hover:border-navy-600"
              }`}
            >
              {active && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-navy-700 text-[10px] font-bold text-white">
                  ✓
                </span>
              )}
              <span className="text-2xl">{AREA_ICONS[area]}</span>
              <span className="mt-1 block text-sm font-semibold text-navy-800">
                {AREA_LABELS[area]}
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-navy-700">
        Tipos de oportunidade
      </h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {TIPOS.map((tipo, i) => {
          const active = tipos.includes(tipo);
          return (
            <label
              key={tipo}
              className={`flex cursor-pointer items-center justify-between px-4 py-3 ${
                i > 0 ? "border-t border-slate-100" : ""
              }`}
            >
              <span className="text-sm font-medium text-navy-800">
                {TIPO_LABELS[tipo]}s
              </span>
              <input
                type="checkbox"
                checked={active}
                onChange={() => setTipos((t) => toggle(t, tipo))}
                className="peer sr-only"
              />
              <span className="relative h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-navy-700 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
            </label>
          );
        })}
      </div>

      {erro && <p className="mt-4 text-sm text-rose-600">{erro}</p>}

      <button
        onClick={submit}
        disabled={busy}
        className="mt-8 w-full rounded-full bg-navy-700 py-3.5 font-semibold text-white transition hover:bg-navy-600 disabled:opacity-60"
      >
        {busy ? "Salvando…" : submitLabel}
      </button>
    </div>
  );
}
