import { hashDedup, normalizeUrl } from "./dedup";

describe("normalizeUrl", () => {
  it("remove parâmetros de tracking", () => {
    expect(
      normalizeUrl("https://ufes.br/edital?utm_source=x&utm_campaign=y&id=5"),
    ).toBe("https://ufes.br/edital?id=5");
  });

  it("normaliza host e barra final", () => {
    expect(normalizeUrl("https://UFES.BR/edital/")).toBe(
      "https://ufes.br/edital",
    );
  });

  it("remove fragmento", () => {
    expect(normalizeUrl("https://ufes.br/edital#secao")).toBe(
      "https://ufes.br/edital",
    );
  });
});

describe("hashDedup", () => {
  it("gera o mesmo hash para variações da mesma URL", () => {
    const a = hashDedup("https://ufes.br/edital/?utm_source=feed");
    const b = hashDedup("https://UFES.br/edital");
    expect(a).toBe(b);
  });

  it("gera hashes diferentes para URLs diferentes", () => {
    expect(hashDedup("https://ufes.br/edital-1")).not.toBe(
      hashDedup("https://ufes.br/edital-2"),
    );
  });
});
