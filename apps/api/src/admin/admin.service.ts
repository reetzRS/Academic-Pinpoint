import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OpportunitiesService } from "../opportunities/opportunities.service";
import { hashDedup } from "../common/dedup";
import { serializeArray } from "../common/json";
import { CreateOpportunityDto, UpdateOpportunityDto } from "./dto";

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private opportunities: OpportunitiesService,
  ) {}

  async create(dto: CreateOpportunityDto) {
    const hash = hashDedup(dto.urlOrigem);
    const existing = await this.prisma.opportunity.findUnique({
      where: { hashDedup: hash },
    });
    if (existing) {
      throw new ConflictException("Oportunidade com esta URL já cadastrada");
    }
    const criada = await this.prisma.opportunity.create({
      data: {
        tipo: dto.tipo,
        titulo: dto.titulo,
        descricao: dto.descricao,
        urlOrigem: dto.urlOrigem,
        hashDedup: hash,
        fonte: "manual",
        instituicao: dto.instituicao,
        local: dto.local,
        valorBolsa: dto.valorBolsa,
        prazoInscricao: dto.prazoInscricao ? new Date(dto.prazoInscricao) : null,
        modalidade: dto.modalidade,
        requisitos: serializeArray(dto.requisitos),
        areas: serializeArray(dto.areas),
      },
    });
    return this.opportunities.findById(criada.id);
  }

  async update(id: string, dto: UpdateOpportunityDto) {
    const existing = await this.prisma.opportunity.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Oportunidade não encontrada");

    const data: Record<string, unknown> = {};

    if (dto.tipo !== undefined) data.tipo = dto.tipo;
    if (dto.titulo !== undefined) data.titulo = dto.titulo;
    if (dto.descricao !== undefined) data.descricao = dto.descricao;
    if (dto.instituicao !== undefined) data.instituicao = dto.instituicao;
    if (dto.local !== undefined) data.local = dto.local;
    if (dto.valorBolsa !== undefined) data.valorBolsa = dto.valorBolsa;
    if (dto.modalidade !== undefined) data.modalidade = dto.modalidade;
    if (dto.requisitos !== undefined) data.requisitos = serializeArray(dto.requisitos);
    if (dto.areas !== undefined) data.areas = serializeArray(dto.areas);
    if (dto.prazoInscricao !== undefined) {
      data.prazoInscricao = new Date(dto.prazoInscricao);
    }

    if (dto.urlOrigem !== undefined) {
      const hash = hashDedup(dto.urlOrigem);
      const conflict = await this.prisma.opportunity.findUnique({
        where: { hashDedup: hash },
      });
      if (conflict && conflict.id !== id) {
        throw new ConflictException("Oportunidade com esta URL já cadastrada");
      }
      data.urlOrigem = dto.urlOrigem;
      data.hashDedup = hash;
    }

    await this.prisma.opportunity.update({ where: { id }, data });
    return this.opportunities.findById(id);
  }

  async remove(id: string) {
    const existing = await this.prisma.opportunity.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Oportunidade não encontrada");
    await this.prisma.opportunity.delete({ where: { id } });
    return { removido: true };
  }
}
