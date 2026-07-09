import { getSession, Session, SessionUser } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface Opportunity {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  urlOrigem: string;
  fonte: string;
  instituicao?: string | null;
  prazoInscricao?: string | null;
  modalidade?: string | null;
  local?: string | null;
  valorBolsa?: string | null;
  requisitos: string[];
  areas: string[];
  coletadoEm: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  const token = getSession()?.token;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json();
      message = Array.isArray(body.message)
        ? body.message.join("; ")
        : (body.message ?? message);
    } catch {
      /* corpo não-JSON */
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  register: (data: { nome: string; email: string; senha: string; curso?: string }) =>
    request<Session>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; senha: string }) =>
    request<Session>("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  updatePreferences: (data: { areas: string[]; tipos: string[] }) =>
    request<SessionUser>("/me/preferences", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  opportunities: (params: {
    tipo?: string;
    q?: string;
    page?: number;
    personalizado?: boolean;
  }) => {
    const search = new URLSearchParams();
    if (params.tipo) search.set("tipo", params.tipo);
    if (params.q) search.set("q", params.q);
    if (params.page) search.set("page", String(params.page));
    if (params.personalizado) search.set("personalizado", "true");
    const qs = search.toString();
    return request<Page<Opportunity>>(`/opportunities${qs ? `?${qs}` : ""}`);
  },
};
