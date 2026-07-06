import { createHash } from "crypto";

/**
 * Normaliza a URL de origem antes de gerar o hash de deduplicação:
 * minúsculas no host, sem barra final, sem parâmetros de tracking.
 * A mesma oportunidade recoletada pelo scraper produz o mesmo hash.
 */
export function normalizeUrl(raw: string): string {
  const url = new URL(raw.trim());
  url.hostname = url.hostname.toLowerCase();
  url.hash = "";
  for (const param of [...url.searchParams.keys()]) {
    if (param.startsWith("utm_") || param === "fbclid" || param === "gclid") {
      url.searchParams.delete(param);
    }
  }
  let result = url.toString();
  if (result.endsWith("/")) result = result.slice(0, -1);
  return result;
}

export function hashDedup(urlOrigem: string): string {
  return createHash("sha256").update(normalizeUrl(urlOrigem)).digest("hex");
}
