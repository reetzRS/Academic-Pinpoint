"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  clearSession,
  getSession,
  SessionUser,
  updateSessionUser,
} from "@/lib/session";
import { AppShell } from "@/components/app-shell";
import { PreferencesForm } from "@/components/preferences-form";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    setUser(getSession()?.user ?? null);
  }, []);

  const submit = async (areas: string[], tipos: string[]) => {
    const updated = await api.updatePreferences({ areas, tipos });
    updateSessionUser(updated);
    setUser(updated);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  return (
    <AppShell>
      <h1 className="mb-4 text-xl font-bold text-navy-800">Configurações</h1>

      {user && (
        <>
          <section className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-700 text-xl font-bold text-white">
              {user.nome.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-bold text-navy-800">{user.nome}</p>
              <p className="text-sm text-slate-500">
                {user.curso ? `Estudante de ${user.curso}` : user.email}
              </p>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 font-bold text-navy-800">
              Preferências de Feed
            </h2>
            {salvo && (
              <p className="mb-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                Preferências salvas!
              </p>
            )}
            <PreferencesForm
              initialAreas={user.areas}
              initialTipos={user.tipos}
              submitLabel="Salvar preferências"
              onSubmit={submit}
            />
          </section>

          <button
            onClick={() => {
              clearSession();
              router.replace("/login");
            }}
            className="mt-8 w-full rounded-full border border-rose-200 bg-rose-50 py-3 font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            Sair
          </button>
        </>
      )}
    </AppShell>
  );
}
