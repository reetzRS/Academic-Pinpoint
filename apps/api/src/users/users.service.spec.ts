import { NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";

function makeUser(overrides: Partial<{
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  curso: string | null;
  role: string;
  areas: string;
  tipos: string;
  onboardingDone: boolean;
  criadoEm: Date;
}> = {}) {
  return {
    id: "user-1",
    nome: "Test User",
    email: "test@example.com",
    senhaHash: "",
    curso: null,
    role: "user",
    areas: "[]",
    tipos: "[]",
    onboardingDone: false,
    criadoEm: new Date(),
    ...overrides,
  };
}

function makePrisma(user: ReturnType<typeof makeUser> | null = null) {
  return {
    user: {
      findUnique: jest.fn().mockResolvedValue(user),
      update: jest.fn().mockResolvedValue(user),
    },
  } as any;
}

describe("UsersService", () => {
  describe("getProfile", () => {
    it("retorna perfil com areas e tipos desserializados e role", async () => {
      const user = makeUser({
        areas: '["Saude","Tecnologia"]',
        tipos: '["Bolsa"]',
        role: "user",
      });
      const prisma = makePrisma(user);
      const svc = new UsersService(prisma);

      const result = await svc.getProfile("user-1");

      expect(result.id).toBe("user-1");
      expect(result.email).toBe("test@example.com");
      expect(result.role).toBe("user");
      expect(result.areas).toEqual(["Saude", "Tecnologia"]);
      expect(result.tipos).toEqual(["Bolsa"]);
      expect(result.onboardingDone).toBe(false);
    });

    it("lanca NotFoundException se usuario nao existe", async () => {
      const prisma = makePrisma(null);
      const svc = new UsersService(prisma);

      await expect(svc.getProfile("nao-existe")).rejects.toThrow(NotFoundException);
    });
  });

  describe("updatePreferences", () => {
    it("chama prisma.user.update com arrays serializados e onboardingDone true", async () => {
      const updated = makeUser({
        areas: '["Saude"]',
        tipos: '["Bolsa"]',
        onboardingDone: true,
      });
      const prisma = makePrisma(updated);
      const svc = new UsersService(prisma);

      const result = await svc.updatePreferences("user-1", {
        areas: ["Saude"],
        tipos: ["Bolsa"],
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: {
          areas: '["Saude"]',
          tipos: '["Bolsa"]',
          onboardingDone: true,
        },
      });
      expect(result.areas).toEqual(["Saude"]);
      expect(result.tipos).toEqual(["Bolsa"]);
      expect(result.onboardingDone).toBe(true);
    });
  });
});
