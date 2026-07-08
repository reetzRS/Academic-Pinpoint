import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { parseArray } from "../common/json";
import { LoginDto, RegisterDto } from "./dto";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException("E-mail já cadastrado");

    const user = await this.prisma.user.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senhaHash: await bcrypt.hash(dto.senha, 10),
        curso: dto.curso,
      },
    });
    return this.buildSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await bcrypt.compare(dto.senha, user.senhaHash))) {
      throw new UnauthorizedException("E-mail ou senha inválidos");
    }
    return this.buildSession(user);
  }

  private buildSession(user: User) {
    return {
      token: this.jwt.sign({ sub: user.id, email: user.email, role: user.role }),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        curso: user.curso,
        role: user.role,
        onboardingDone: user.onboardingDone,
        areas: parseArray(user.areas),
        tipos: parseArray(user.tipos),
      },
    };
  }
}
