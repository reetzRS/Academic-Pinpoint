export interface SessionUser {
  id: string;
  nome: string;
  email: string;
  curso?: string | null;
  role: string;
  onboardingDone: boolean;
  areas: string[];
  tipos: string[];
}

export interface Session {
  token: string;
  user: SessionUser;
}

const KEY = "academic-pinpoint-session";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function updateSessionUser(user: SessionUser) {
  const session = getSession();
  if (session) setSession({ ...session, user });
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
