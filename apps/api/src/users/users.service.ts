import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { parseArray, serializeArray } from "../common/json";
import { PreferencesDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      curso: user.curso,
      role: user.role,
      onboardingDone: user.onboardingDone,
      areas: parseArray(user.areas),
      tipos: parseArray(user.tipos),
    };
  }

  async updatePreferences(userId: string, dto: PreferencesDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        areas: serializeArray(dto.areas),
        tipos: serializeArray(dto.tipos),
        onboardingDone: true,
      },
    });
    return this.getProfile(userId);
  }
}
