import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@academic-pinpoint/shared";

/** Uso combinado: @UseGuards(JwtAuthGuard, RolesGuard) + @Roles("admin") na rota ou na classe. */
export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>("roles", [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;
    const req = ctx.switchToHttp().getRequest();
    if (!req.user) throw new UnauthorizedException();
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenException("Acesso restrito a administradores");
    }
    return true;
  }
}
