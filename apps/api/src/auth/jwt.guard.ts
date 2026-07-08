import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  createParamDecorator,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "@academic-pinpoint/shared";

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

function extractPayload(jwt: JwtService, ctx: ExecutionContext): JwtPayload | null {
  const req = ctx.switchToHttp().getRequest();
  const [scheme, token] = (req.headers.authorization ?? "").split(" ");
  if (scheme !== "Bearer" || !token) return null;
  try {
    return jwt.verify<JwtPayload>(token);
  } catch {
    return null;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const payload = extractPayload(this.jwt, ctx);
    if (!payload) throw new UnauthorizedException();
    ctx.switchToHttp().getRequest().user = payload;
    return true;
  }
}

/** Não exige login, mas identifica o usuário se houver token (ex.: flag "salvo" no feed). */
@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    ctx.switchToHttp().getRequest().user = extractPayload(this.jwt, ctx);
    return true;
  }
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload | null =>
    ctx.switchToHttp().getRequest().user ?? null,
);
