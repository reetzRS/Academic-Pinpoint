"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, AdminOpportunityInput, Opportunity } from "@/lib/api";
import { OpportunityForm } from "@/components/opportunity-form";

export default function EditarOportunidadePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [oportunidade, setOportunidade] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api
      .opportunity(id)
      .then(setOportunidade)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: AdminOpportunityInput) => {
    await api.adminUpdate(id, data);
    router.replace("/admin");
  };

  if (loading) {
    return <p className="py-6 text-center text-sm text-slate-400">Carregando…</p>;
  }

  if (erro || !oportunidade) {
    return (
      <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
        {erro ?? "Oportunidade não encontrada."}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-xl font-bold text-navy-800">Editar oportunidade</h1>
      <OpportunityForm initial={oportunidade} onSubmit={handleSubmit} />
    </div>
  );
}
