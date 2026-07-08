import { getSession, Session } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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
};
