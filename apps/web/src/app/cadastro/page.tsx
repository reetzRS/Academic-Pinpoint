"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { setSession } from "@/lib/session";
import { LogoMark } from "@/components/icons";

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", curso: "" });
  const [erro, setErro] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErro(null);
    try {
      const session = await api.register({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        curso: form.curso || undefined,
      });
      setSession(session);
      router.replace("/onboarding");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar");
      setBusy(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-navy-600";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-800 px-4 py-8">
      <LogoMark className="h-12 w-12 text-gold-400" />
      <h1 className="mt-3 text-2xl font-extrabold uppercase tracking-wide text-white">
        Criar conta
      </h1>

      <form
        onSubmit={submit}
        className="mt-6 w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
      >
        <label className="block text-sm font-semibold text-navy-800">
          Nome
          <input required value={form.nome} onChange={set("nome")} className={inputClass} />
        </label>
        <label className="mt-4 block text-sm font-semibold text-navy-800">
          E-mail
          <input
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            className={inputClass}
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-navy-800">
          Senha (mín. 6 caracteres)
          <input
            type="password"
            required
            minLength={6}
            value={form.senha}
            onChange={set("senha")}
            className={inputClass}
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-navy-800">
          Curso (opcional)
          <input value={form.curso} onChange={set("curso")} className={inputClass} />
        </label>

        {erro && <p className="mt-3 text-sm text-rose-600">{erro}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-navy-700 py-3 font-semibold text-white transition hover:bg-navy-600 disabled:opacity-60"
        >
          {busy ? "Criando…" : "Criar conta"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-navy-700">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
