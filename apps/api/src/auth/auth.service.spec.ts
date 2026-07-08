import { ConflictException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { AuthService } from "./auth.service";

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
      create: jest.fn().mockResolvedValue(user),
    },
  } as any;
}

function makeJwt() {
  return {
    sign: jest.fn().mockReturnValue("signed-token"),
  } as any;
}

describe("AuthService", () => {
  describe("register", () => {
    it("cria usuario e retorna token e user com role", async () => {
      const hash = await bcrypt.hash("senha123", 10);
      const user = makeUser({ senhaHash: hash });
      const prisma = makePrisma(null);
      prisma.user.create.mockResolvedValue(user);
      const jwt = makeJwt();
      const svc = new AuthService(prisma, jwt);

      const result = await svc.register({
        nome: "Test User",
        email: "test@example.com",
        senha: "senha123",
      });

      expect(result.token).toBe("signed-token");
      expect(result.user.email).toBe("test@example.com");
      expect(result.user.role).toBe("user");
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ sub: user.id, email: user.email, role: user.role }),
      );
    });

    it("lanca ConflictException se e-mail ja existe", async () => {
      const user = makeUser();
      const prisma = makePrisma(user);
      const svc = new AuthService(prisma, makeJwt());

      const promise = svc.register({
        nome: "Test",
        email: "test@example.com",
        senha: "senha123",
      });
      await expect(promise).rejects.toThrow(ConflictException);
      await expect(promise).rejects.toThrow("E-mail já cadastrado");
    });
  });

  describe("login", () => {
    it("retorna sessao com senha correta", async () => {
      const hash = await bcrypt.hash("senha123", 10);
      const user = makeUser({ senhaHash: hash });
      const prisma = makePrisma(user);
      const jwt = makeJwt();
      const svc = new AuthService(prisma, jwt);

      const result = await svc.login({ email: "test@example.com", senha: "senha123" });

      expect(result.token).toBe("signed-token");
      expect(result.user.email).toBe("test@example.com");
      expect(result.user.role).toBe("user");
    });

    it("lanca UnauthorizedException com senha errada", async () => {
      const hash = await bcrypt.hash("senha123", 10);
      const user = makeUser({ senhaHash: hash });
      const prisma = makePrisma(user);
      const svc = new AuthService(prisma, makeJwt());

      const promise = svc.login({ email: "test@example.com", senha: "errada" });
      await expect(promise).rejects.toThrow(UnauthorizedException);
      await expect(promise).rejects.toThrow("E-mail ou senha inválidos");
    });

    it("lanca UnauthorizedException com e-mail inexistente", async () => {
      const prisma = makePrisma(null);
      const svc = new AuthService(prisma, makeJwt());

      const promise = svc.login({ email: "nao@existe.com", senha: "senha123" });
      await expect(promise).rejects.toThrow(UnauthorizedException);
      await expect(promise).rejects.toThrow("E-mail ou senha inválidos");
    });
  });

  describe("payload do JWT", () => {
    it("inclui role no payload assinado para usuario admin", async () => {
      const hash = await bcrypt.hash("senha123", 10);
      const user = makeUser({ senhaHash: hash, role: "admin", email: "admin@example.com" });
      const prisma = makePrisma(user);
      const jwt = makeJwt();
      const svc = new AuthService(prisma, jwt);

      await svc.login({ email: "admin@example.com", senha: "senha123" });

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ role: "admin" }),
      );
    });
  });
});
