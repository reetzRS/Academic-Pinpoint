"use client";

import { useState } from "react";
import {
  AREAS,
  AREA_LABELS,
  MODALIDADES,
  MODALIDADE_LABELS,
  TIPOS,
  TIPO_LABELS,
} from "@academic-pinpoint/shared";
import { AdminOpportunityInput, ApiError, Opportunity } from "@/lib/api";

export function OpportunityForm({
  initial,
  onSubmit,
}: {
  initial?: Opportunity;
  onSubmit: (data: AdminOpportunityInput) => Promise<void>;
}) {
  const [tipo, setTipo] = useState(initial?.tipo ?? TIPOS[0]);
  const [titulo, setTitulo] = useState(initial?.titulo ?? "");
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [urlOrigem, setUrlOrigem] = useState(initial?.urlOrigem ?? "");
  const [instituicao, setInstituicao] = useState(initial?.instituicao ?? "");
  const [local, setLocal] = useState(initial?.local ?? "");
  const [valorBolsa, setValorBolsa] = useState(initial?.valorBolsa ?? "");
  const [prazoInscricao, setPrazoInscricao] = useState(
    initial?.prazoInscricao ? initial.prazoInscricao.slice(0, 10) : "",
  );
  const [modalidade, setModalidade] = useState(initial?.modalidade ?? "");
  const [requisitosTexto, setRequisitosTexto] = useState(
    (initial?.requisitos ?? []).join("\n"),
  );
  const [areas, setAreas] = useState<string[]>(initial?.areas ?? []);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const toggleArea = (area: string) => {
    setAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErro(null);

    const payload: AdminOpportunityInput = {
      tipo,
      titulo,
      descricao,
      urlOrigem,
      areas,
    };

    // omitir campos opcionais vazios
    if (instituicao) payload.instituicao = instituicao;
    if (local) payload.local = local;
    if (valorBolsa) payload.valorBolsa = valorBolsa;
    if (prazoInscricao) payload.prazoInscricao = prazoInscricao;
    if (modalidade) payload.modalidade = modalidade;
    const requisitos = requisitosTexto
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (requisitos.length > 0) payload.requisitos = requisitos;

    try {
      await onSubmit(payload);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Erro ao salvar");
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy-800 outline-none focus:border-navy-600";
  const labelClass = "mb-1 block text-sm font-semibold text-navy-700";

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {/* Tipo */}
      <div>
        <label className={labelClass}>Tipo</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
          className={inputClass}
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {TIPO_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {/* Título */}
      <div>
        <label className={labelClass}>Título</label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          minLength={3}
          className={inputClass}
        />
      </div>

      {/* Descrição */}
      <div>
        <label className={labelClass}>Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
          rows={4}
          className={inputClass}
        />
      </div>

      {/* URL de Origem */}
      <div>
        <label className={labelClass}>URL de Origem</label>
        <input
          value={urlOrigem}
          onChange={(e) => setUrlOrigem(e.target.value)}
          required
          type="url"
          className={inputClass}
        />
      </div>

      {/* Instituição */}
      <div>
        <label className={labelClass}>Instituição (opcional)</label>
        <input
          value={instituicao}
          onChange={(e) => setInstituicao(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Local */}
      <div>
        <label className={labelClass}>Local (opcional)</label>
        <input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Valor da Bolsa */}
      <div>
        <label className={labelClass}>Valor da Bolsa (opcional)</label>
        <input
          value={valorBolsa}
          onChange={(e) => setValorBolsa(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Prazo de Inscrição */}
      <div>
        <label className={labelClass}>Prazo de Inscrição (opcional)</label>
        <input
          type="date"
          value={prazoInscricao}
          onChange={(e) => setPrazoInscricao(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Modalidade */}
      <div>
        <label className={labelClass}>Modalidade (opcional)</label>
        <select
          value={modalidade}
          onChange={(e) => setModalidade(e.target.value)}
          className={inputClass}
        >
          <option value="">— Selecionar —</option>
          {MODALIDADES.map((m) => (
            <option key={m} value={m}>
              {MODALIDADE_LABELS[m]}
            </option>
          ))}
        </select>
      </div>

      {/* Requisitos */}
      <div>
        <label className={labelClass}>Requisitos (opcional, um por linha)</label>
        <textarea
          value={requisitosTexto}
          onChange={(e) => setRequisitosTexto(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>

      {/* Áreas */}
      <div>
        <label className={labelClass}>Áreas</label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {AREAS.map((area) => {
            const active = areas.includes(area);
            return (
              <label
                key={area}
                className={`flex cursor-pointer items-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border-navy-700 bg-navy-50 text-navy-800"
                    : "border-slate-200 bg-white text-slate-600 hover:border-navy-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleArea(area)}
                  className="sr-only"
                />
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    active ? "border-navy-700 bg-navy-700" : "border-slate-300"
                  }`}
                >
                  {active && (
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3 fill-white"
                      aria-hidden
                    >
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth={2} fill="none" />
                    </svg>
                  )}
                </span>
                {AREA_LABELS[area]}
              </label>
            );
          })}
        </div>
      </div>

      {erro && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-navy-700 py-3.5 font-semibold text-white transition hover:bg-navy-600 disabled:opacity-60"
      >
        {busy ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
