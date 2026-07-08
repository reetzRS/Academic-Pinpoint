export function formatDate(iso?: string | null): string {
  if (!iso) return "Sem prazo";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
}

export function daysLeft(iso?: string | null): number | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const deadline = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((deadline.getTime() - today.getTime()) / 86_400_000);
}

/** Cores de badge por tipo, seguindo o prototipo */
export const TIPO_BADGE: Record<string, string> = {
  bolsa: "bg-emerald-100 text-emerald-800",
  edital: "bg-blue-100 text-blue-800",
  estagio: "bg-violet-100 text-violet-800",
  evento: "bg-amber-100 text-amber-800",
  intercambio: "bg-cyan-100 text-cyan-800",
  concurso: "bg-rose-100 text-rose-800",
};

/** Icones por area, seguindo o prototipo */
export const AREA_ICONS: Record<string, string> = {
  tecnologia: "💻",
  biologicas: "🧬",
  humanas: "📚",
  exatas: "📊",
  "sociais-aplicadas": "🌐",
  "meio-ambiente": "🌿",
  "artes-design": "🎨",
  saude: "⚕️",
  empreendedorismo: "🚀",
};
