import { Injectable, NotFoundException } from "@nestjs/common";
import { Opportunity, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { parseArray } from "../common/json";
import { FindOpportunitiesQuery } from "./dto";

const PAGE_SIZE_DEFAULT = 10;

export interface UserPrefs {
  areas: string[];
  tipos: string[];
}

/**
 * Monta o where do Prisma a partir dos filtros. Função pura e exportada
 * para ser testável sem banco.
 *
 * Nota SQLite: colunas array são JSON-em-string, então o filtro de área
 * usa `contains` no literal `"area"`. Ao migrar para Postgres, trocar
 * por `hasSome` em String[].
 */
export function buildWhere(
  query: FindOpportunitiesQuery,
  prefs?: UserPrefs,
): Prisma.OpportunityWhereInput {
  const and: Prisma.OpportunityWhereInput[] = [];

  if (query.apenasAbertas !== false) {
    const hojeInicio = new Date();
    hojeInicio.setHours(0, 0, 0, 0);
    and.push({
      OR: [{ prazoInscricao: null }, { prazoInscricao: { gte: hojeInicio } }],
    });
  }

  if (query.q) {
    and.push({
      OR: [
        { titulo: { contains: query.q } },
        { descricao: { contains: query.q } },
        { instituicao: { contains: query.q } },
      ],
    });
  }

  // Filtro explícito tem prioridade; preferências só entram na ausência dele
  const tipos = query.tipo
    ? [query.tipo]
    : query.personalizado && prefs?.tipos.length
      ? prefs.tipos
      : [];
  if (tipos.length) and.push({ tipo: { in: tipos } });

  const areas = query.areas?.length
    ? query.areas
    : query.personalizado && prefs?.areas.length
      ? prefs.areas
      : [];
  if (areas.length) {
    and.push({ OR: areas.map((a) => ({ areas: { contains: `"${a}"` } })) });
  }

  return and.length ? { AND: and } : {};
}

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) {}

  async find(query: FindOpportunitiesQuery, userId?: string) {
    let prefs: UserPrefs | undefined;
    if (query.personalizado && userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        prefs = { areas: parseArray(user.areas), tipos: parseArray(user.tipos) };
      }
    }

    const where = buildWhere(query, prefs);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? PAGE_SIZE_DEFAULT;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.opportunity.count({ where }),
      this.prisma.opportunity.findMany({
        where,
        orderBy: [{ prazoInscricao: { sort: "asc", nulls: "last" } }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      items: items.map((o) => this.toDto(o)),
    };
  }

  async findById(id: string) {
    const opp = await this.prisma.opportunity.findUnique({ where: { id } });
    if (!opp) throw new NotFoundException("Oportunidade não encontrada");
    return this.toDto(opp);
  }

  private toDto(o: Opportunity) {
    return {
      id: o.id,
      tipo: o.tipo,
      titulo: o.titulo,
      descricao: o.descricao,
      urlOrigem: o.urlOrigem,
      fonte: o.fonte,
      instituicao: o.instituicao,
      prazoInscricao: o.prazoInscricao?.toISOString().slice(0, 10) ?? null,
      modalidade: o.modalidade,
      local: o.local,
      valorBolsa: o.valorBolsa,
      requisitos: parseArray(o.requisitos),
      areas: parseArray(o.areas),
      coletadoEm: o.coletadoEm.toISOString(),
    };
  }
}
