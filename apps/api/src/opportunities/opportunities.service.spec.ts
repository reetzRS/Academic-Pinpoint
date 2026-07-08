import { NotFoundException } from "@nestjs/common";
import { buildWhere, OpportunitiesService } from "./opportunities.service";

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

function makeOpportunity(overrides: Partial<{
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  urlOrigem: string;
  hashDedup: string;
  fonte: string;
  instituicao: string | null;
  prazoInscricao: Date | null;
  modalidade: string | null;
  local: string | null;
  valorBolsa: string | null;
  requisitos: string;
  areas: string;
  coletadoEm: Date;
  atualizadoEm: Date;
}> = {}) {
  return {
    id: "opp-1",
    tipo: "bolsa",
    titulo: "Bolsa de pesquisa",
    descricao: "Descricao da bolsa",
    urlOrigem: "https://example.com",
    hashDedup: "hash-1",
    fonte: "capes",
    instituicao: null,
    prazoInscricao: null,
    modalidade: null,
    local: null,
    valorBolsa: null,
    requisitos: "[]",
    areas: "[]",
    coletadoEm: new Date("2024-01-01T00:00:00Z"),
    atualizadoEm: new Date("2024-01-01T00:00:00Z"),
    ...overrides,
  };
}

function makePrisma(overrides: {
  opportunityFindUnique?: jest.Mock;
  savedOpportunityUpsert?: jest.Mock;
  savedOpportunityDeleteMany?: jest.Mock;
  savedOpportunityFindMany?: jest.Mock;
} = {}) {
  return {
    opportunity: {
      findUnique: overrides.opportunityFindUnique ?? jest.fn().mockResolvedValue(null),
    },
    savedOpportunity: {
      upsert: overrides.savedOpportunityUpsert ?? jest.fn().mockResolvedValue({}),
      deleteMany: overrides.savedOpportunityDeleteMany ?? jest.fn().mockResolvedValue({ count: 0 }),
      findMany: overrides.savedOpportunityFindMany ?? jest.fn().mockResolvedValue([]),
    },
  } as any;
}

describe("salvos", () => {
  describe("save", () => {
    it("chama upsert com chave composta e retorna { salvo: true }", async () => {
      const opp = makeOpportunity();
      const upsert = jest.fn().mockResolvedValue({});
      const prisma = makePrisma({
        opportunityFindUnique: jest.fn().mockResolvedValue(opp),
        savedOpportunityUpsert: upsert,
        savedOpportunityFindMany: jest.fn().mockResolvedValue([]),
      });
      const svc = new OpportunitiesService(prisma);

      const result = await svc.save("user-1", "opp-1");

      expect(upsert).toHaveBeenCalledWith({
        where: { userId_opportunityId: { userId: "user-1", opportunityId: "opp-1" } },
        create: { userId: "user-1", opportunityId: "opp-1" },
        update: {},
      });
      expect(result).toEqual({ salvo: true });
    });

    it("lanca NotFoundException se oportunidade nao existe", async () => {
      const prisma = makePrisma({
        opportunityFindUnique: jest.fn().mockResolvedValue(null),
      });
      const svc = new OpportunitiesService(prisma);

      await expect(svc.save("user-1", "nao-existe")).rejects.toThrow(NotFoundException);
    });
  });

  describe("unsave", () => {
    it("chama deleteMany com userId e opportunityId e retorna { salvo: false }", async () => {
      const deleteMany = jest.fn().mockResolvedValue({ count: 1 });
      const prisma = makePrisma({ savedOpportunityDeleteMany: deleteMany });
      const svc = new OpportunitiesService(prisma);

      const result = await svc.unsave("user-1", "opp-1");

      expect(deleteMany).toHaveBeenCalledWith({
        where: { userId: "user-1", opportunityId: "opp-1" },
      });
      expect(result).toEqual({ salvo: false });
    });
  });

  describe("listSaved", () => {
    it("retorna DTOs com salvo: true na ordem vinda do banco", async () => {
      const opp1 = makeOpportunity({ id: "opp-1", titulo: "Primeira" });
      const opp2 = makeOpportunity({ id: "opp-2", titulo: "Segunda" });
      const prisma = makePrisma({
        savedOpportunityFindMany: jest.fn().mockResolvedValue([
          { opportunity: opp1 },
          { opportunity: opp2 },
        ]),
      });
      const svc = new OpportunitiesService(prisma);

      const result = await svc.listSaved("user-1");

      expect(prisma.savedOpportunity.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        include: { opportunity: true },
        orderBy: { salvoEm: "desc" },
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("opp-1");
      expect(result[0].salvo).toBe(true);
      expect(result[1].id).toBe("opp-2");
      expect(result[1].salvo).toBe(true);
    });
  });
});
