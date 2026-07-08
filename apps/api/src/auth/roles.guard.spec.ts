import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";

function makeContext(user?: object | null): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

function makeReflector(roles?: string[]) {
  return {
    getAllAndOverride: jest.fn().mockReturnValue(roles),
  } as unknown as Reflector;
}

describe("RolesGuard", () => {
  it("libera quando nao ha metadata de roles", () => {
    const guard = new RolesGuard(makeReflector(undefined));
    const ctx = makeContext(null);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("libera usuario com role admin quando roles exige admin", () => {
    const guard = new RolesGuard(makeReflector(["admin"]));
    const ctx = makeContext({ role: "admin" });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("lanca ForbiddenException quando role e user mas nao admin", () => {
    const guard = new RolesGuard(makeReflector(["admin"]));
    const ctx = makeContext({ role: "user" });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(ctx)).toThrow("Acesso restrito a administradores");
  });

  it("lanca UnauthorizedException quando nao ha user no request", () => {
    const guard = new RolesGuard(makeReflector(["admin"]));
    const ctx = makeContext(null);
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });
});
