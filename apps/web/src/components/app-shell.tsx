"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSession, Session } from "@/lib/session";
import {
  BookmarkIcon,
  ClipboardIcon,
  CompassIcon,
  HomeIcon,
  LogoMark,
  UserIcon,
} from "./icons";

const NAV = [
  { href: "/", label: "Início", icon: HomeIcon },
  { href: "/explorar", label: "Explorar", icon: CompassIcon },
  { href: "/salvos", label: "Salvos", icon: BookmarkIcon },
  { href: "/configuracoes", label: "Perfil", icon: UserIcon },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark className="h-7 w-7 text-gold-400" />
      {!compact && (
        <span className="text-sm font-extrabold uppercase leading-tight tracking-wide text-white">
          Academic
          <br />
          Pinpoint
        </span>
      )}
    </span>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSessionState] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    if (!s.user.onboardingDone && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }
    setSessionState(s);
    setChecked(true);
    // pathname intencionalmente fora das deps: a checagem é por montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (!checked || !session) return null;

  const sair = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col bg-navy-800 px-4 py-6 md:flex">
        <Link href="/" className="px-2">
          <Logo />
        </Link>
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-gold-400 text-navy-900"
                    : "text-navy-100 hover:bg-navy-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
          {session.user.role === "admin" && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                pathname.startsWith("/admin")
                  ? "bg-gold-400 text-navy-900"
                  : "text-navy-100 hover:bg-navy-700"
              }`}
            >
              <ClipboardIcon className="h-5 w-5" />
              Gestão
            </Link>
          )}
        </nav>
        <div className="border-t border-navy-700 pt-4">
          <p className="truncate px-3 text-sm font-semibold text-white">
            {session.user.nome}
          </p>
          <p className="truncate px-3 text-xs text-navy-100">
            {session.user.email}
          </p>
          <button
            onClick={sair}
            className="mt-3 w-full rounded-xl px-3 py-2 text-left text-sm text-navy-100 hover:bg-navy-700"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Header — mobile */}
      <header className="sticky top-0 z-20 flex items-center justify-center bg-navy-800 px-4 py-3 md:hidden">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <main className="pb-24 pt-6 md:ml-60 md:pb-10">
        <div className="mx-auto max-w-3xl px-4 md:max-w-4xl">{children}</div>
      </main>

      {/* Bottom nav — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-slate-200 bg-white py-2 md:hidden">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium ${
                active ? "text-navy-700" : "text-slate-400"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
        {session.user.role === "admin" && (
          <Link
            href="/admin"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium ${
              pathname.startsWith("/admin") ? "text-navy-700" : "text-slate-400"
            }`}
          >
            <ClipboardIcon className="h-5 w-5" />
            Gestão
          </Link>
        )}
      </nav>
    </div>
  );
}
