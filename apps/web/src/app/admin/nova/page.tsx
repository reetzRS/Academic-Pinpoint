"use client";

import { useRouter } from "next/navigation";
import { api, AdminOpportunityInput } from "@/lib/api";
import { OpportunityForm } from "@/components/opportunity-form";

export default function NovaOportunidadePage() {
  const router = useRouter();

  const handleSubmit = async (data: AdminOpportunityInput) => {
    await api.adminCreate(data);
    router.replace("/admin");
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-xl font-bold text-navy-800">Nova oportunidade</h1>
      <OpportunityForm onSubmit={handleSubmit} />
    </div>
  );
}
