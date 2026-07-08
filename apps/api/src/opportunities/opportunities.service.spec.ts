import { buildWhere } from "./opportunities.service";

describe("buildWhere", () => {
  it("sem filtros, aplica apenas o corte de prazo aberto", () => {
    const where = buildWhere({});
    expect(where.AND).toHaveLength(1);
  });

  it("permite incluir vencidas com apenasAbertas=false", () => {
    expect(buildWhere({ apenasAbertas: false })).toEqual({});
  });

  it("filtro explícito de tipo tem prioridade sobre preferências", () => {
    const where = buildWhere(
      { tipo: "evento", personalizado: true, apenasAbertas: false },
      { tipos: ["bolsa", "estagio"], areas: [] },
    );
    expect(where.AND).toEqual([{ tipo: { in: ["evento"] } }]);
  });

  it("personalizado aplica tipos e áreas das preferências", () => {
    const where = buildWhere(
      { personalizado: true, apenasAbertas: false },
      { tipos: ["bolsa"], areas: ["tecnologia", "saude"] },
    );
    expect(where.AND).toEqual([
      { tipo: { in: ["bolsa"] } },
      {
        OR: [
          { areas: { contains: '"tecnologia"' } },
          { areas: { contains: '"saude"' } },
        ],
      },
    ]);
  });

  it("busca textual cobre título, descrição e instituição", () => {
    const where = buildWhere({ q: "cnpq", apenasAbertas: false });
    expect(where.AND).toEqual([
      {
        OR: [
          { titulo: { contains: "cnpq" } },
          { descricao: { contains: "cnpq" } },
          { instituicao: { contains: "cnpq" } },
        ],
      },
    ]);
  });
});
