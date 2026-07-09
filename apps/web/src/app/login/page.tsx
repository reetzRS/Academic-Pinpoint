"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { setSession } from "@/lib/session";
import { LogoMark } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErro(null);
    try {
      const session = await api.login({ email, senha });
      setSession(session);
      router.replace(session.user.onboardingDone ? "/" : "/onboarding");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao entrar");
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-800 px-4">
      <LogoMark className="h-12 w-12 text-gold-400" />
      <h1 className="mt-3 text-center text-2xl font-extrabold uppercase tracking-wide text-white">
        Academic Pinpoint
      </h1>
      <p className="mt-1 text-sm text-navy-100">
        Suas oportunidades acadêmicas em um só lugar
      </p>

      <form
        onSubmit={submit}
        className="mt-8 w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
      >
        <label className="block text-sm font-semibold text-navy-800">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-navy-600"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-navy-800">
          Senha
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-navy-600"
          />
        </label>

        {erro && <p className="mt-3 text-sm text-rose-600">{erro}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-navy-700 py-3 font-semibold text-white transition hover:bg-navy-600 disabled:opacity-60"
        >
          {busy ? "Entrando…" : "Entrar"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-navy-700">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
