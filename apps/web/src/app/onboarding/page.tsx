"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getSession, updateSessionUser } from "@/lib/session";
import { PreferencesForm } from "@/components/preferences-form";

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const submit = async (areas: string[], tipos: string[]) => {
    const user = await api.updatePreferences({ areas, tipos });
    updateSessionUser(user);
    router.replace("/");
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-navy-800">
        Personalize seu Feed
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Selecione seus principais interesses para receber conteúdos e
        oportunidades relevantes para você.
      </p>
      <div className="mt-6">
        <PreferencesForm submitLabel="Começar Jornada 🚀" onSubmit={submit} />
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">
        Você poderá ajustar suas preferências a qualquer momento em
        Configurações.
      </p>
    </div>
  );
}
