import {
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { hashDedup } from "../common/dedup";
import { serializeArray } from "../common/json";

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
    titulo: "Bolsa teste",
    descricao: "Descricao",
    urlOrigem: "https://example.com/oportunidade",
    hashDedup: hashDedup("https://example.com/oportunidade"),
    fonte: "manual",
    instituicao: null,
    prazoInscricao: null,
    modalidade: null,
    local: null,
    valorBolsa: null,
    requisitos: "[]",
    areas: '["tecnologia"]',
    coletadoEm: new Date("2024-01-01T00:00:00Z"),
    atualizadoEm: new Date("2024-01-01T00:00:00Z"),
    ...overrides,
  };
}

function makePrisma(overrides: {
  opportunityFindUnique?: jest.Mock;
  opportunityCreate?: jest.Mock;
  opportunityUpdate?: jest.Mock;
  opportunityDelete?: jest.Mock;
} = {}) {
  return {
    opportunity: {
      findUnique: overrides.opportunityFindUnique ?? jest.fn().mockResolvedValue(null),
      create: overrides.opportunityCreate ?? jest.fn().mockResolvedValue(makeOpportunity()),
      update: overrides.opportunityUpdate ?? jest.fn().mockResolvedValue(makeOpportunity()),
      delete: overrides.opportunityDelete ?? jest.fn().mockResolvedValue(makeOpportunity()),
    },
  } as any;
}

function makeOpportunitiesService(dto: object = {}) {
  return {
    findById: jest.fn().mockResolvedValue(dto),
  } as any;
}

describe("AdminService", () => {
  describe("create", () => {
    it("cria com fonte manual, hash calculado e arrays serializados", async () => {
      const url = "https://example.com/nova";
      const hash = hashDedup(url);
      const opp = makeOpportunity({ id: "opp-new", urlOrigem: url, hashDedup: hash });
      const opportunityCreate = jest.fn().mockResolvedValue(opp);
      const prisma = makePrisma({
        opportunityFindUnique: jest.fn().mockResolvedValue(null),
        opportunityCreate,
      });
      const oppDto = { id: "opp-new" };
      const opportunities = makeOpportunitiesService(oppDto);
      const svc = new AdminService(prisma, opportunities);

      const dto = {
        tipo: "bolsa",
        titulo: "Nova bolsa",
        descricao: "Descricao da bolsa",
        urlOrigem: url,
        areas: ["tecnologia"],
        requisitos: ["Graduacao"],
      };

      const result = await svc.create(dto as any);

      expect(opportunityCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          fonte: "manual",
          hashDedup: hash,
          urlOrigem: url,
          areas: serializeArray(["tecnologia"]),
          requisitos: serializeArray(["Graduacao"]),
        }),
      });
      expect(opportunities.findById).toHaveBeenCalledWith("opp-new");
      expect(result).toEqual(oppDto);
    });

    it("lanca ConflictException quando URL ja existe", async () => {
      const url = "https://example.com/existente";
      const existing = makeOpportunity({ urlOrigem: url, hashDedup: hashDedup(url) });
      const prisma = makePrisma({
        opportunityFindUnique: jest.fn().mockResolvedValue(existing),
      });
      const svc = new AdminService(prisma, makeOpportunitiesService());

      const dto = {
        tipo: "bolsa",
        titulo: "Bolsa existente",
        descricao: "Desc",
        urlOrigem: url,
        areas: ["exatas"],
      };

      await expect(svc.create(dto as any)).rejects.toThrow(ConflictException);
      await expect(svc.create(dto as any)).rejects.toThrow(
        "Oportunidade com esta URL já cadastrada",
      );
    });
  });

  describe("update", () => {
    it("lanca NotFoundException se id nao existe", async () => {
      const prisma = makePrisma({
        opportunityFindUnique: jest.fn().mockResolvedValue(null),
      });
      const svc = new AdminService(prisma, makeOpportunitiesService());

      await expect(svc.update("nao-existe", { titulo: "Novo" } as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("recalcula hash quando urlOrigem muda e aplica conflito", async () => {
      const novaUrl = "https://example.com/outra";
      const novoHash = hashDedup(novaUrl);
      const existing = makeOpportunity({ id: "opp-1" });
      const conflicting = makeOpportunity({ id: "opp-2", hashDedup: novoHash });

      const opportunityFindUnique = jest
        .fn()
        .mockResolvedValueOnce(existing) // verifica existencia
        .mockResolvedValueOnce(conflicting); // verifica conflito de hash

      const prisma = makePrisma({ opportunityFindUnique });
      const svc = new AdminService(prisma, makeOpportunitiesService());

      await expect(
        svc.update("opp-1", { urlOrigem: novaUrl } as any),
      ).rejects.toThrow(ConflictException);
    });

    it("nao conflita quando o hash pertence ao proprio registro", async () => {
      const existing = makeOpportunity({ id: "opp-1" });
      const opportunityFindUnique = jest
        .fn()
        .mockResolvedValueOnce(existing) // verifica existencia
        .mockResolvedValueOnce(existing); // hash encontrado e o do proprio registro
      const opportunityUpdate = jest.fn().mockResolvedValue(existing);
      const prisma = makePrisma({ opportunityFindUnique, opportunityUpdate });
      const svc = new AdminService(prisma, makeOpportunitiesService());

      await svc.update("opp-1", { urlOrigem: existing.urlOrigem } as any);

      expect(opportunityUpdate).toHaveBeenCalledWith({
        where: { id: "opp-1" },
        data: {
          urlOrigem: existing.urlOrigem,
          hashDedup: existing.hashDedup,
        },
      });
    });

    it("nao toca campos ausentes do dto", async () => {
      const opp = makeOpportunity({ id: "opp-1" });
      const opportunityUpdate = jest.fn().mockResolvedValue(opp);
      const prisma = makePrisma({
        opportunityFindUnique: jest.fn().mockResolvedValue(opp),
        opportunityUpdate,
      });
      const oppDto = { id: "opp-1" };
      const opportunities = makeOpportunitiesService(oppDto);
      const svc = new AdminService(prisma, opportunities);

      await svc.update("opp-1", { titulo: "Novo titulo" } as any);

      expect(opportunityUpdate).toHaveBeenCalledWith({
        where: { id: "opp-1" },
        data: { titulo: "Novo titulo" },
      });
      expect(opportunities.findById).toHaveBeenCalledWith("opp-1");
    });
  });

  describe("remove", () => {
    it("lanca NotFoundException se id nao existe", async () => {
      const prisma = makePrisma({
        opportunityFindUnique: jest.fn().mockResolvedValue(null),
      });
      const svc = new AdminService(prisma, makeOpportunitiesService());

      await expect(svc.remove("nao-existe")).rejects.toThrow(NotFoundException);
    });

    it("deleta e retorna { removido: true }", async () => {
      const opp = makeOpportunity();
      const opportunityDelete = jest.fn().mockResolvedValue(opp);
      const prisma = makePrisma({
        opportunityFindUnique: jest.fn().mockResolvedValue(opp),
        opportunityDelete,
      });
      const svc = new AdminService(prisma, makeOpportunitiesService());

      const result = await svc.remove("opp-1");

      expect(opportunityDelete).toHaveBeenCalledWith({ where: { id: "opp-1" } });
      expect(result).toEqual({ removido: true });
    });
  });
});
