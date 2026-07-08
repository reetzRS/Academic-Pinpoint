/** Colunas array são JSON-em-string no SQLite; helpers de (de)serialização. */
export function parseArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializeArray(value: string[] | undefined): string {
  return JSON.stringify(value ?? []);
}
