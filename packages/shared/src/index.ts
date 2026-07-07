/**
 * Taxonomia unificada do Academic Pinpoint.
 *
 * Decisão de projeto: o protótipo usa duas taxonomias diferentes
 * (chips do feed vs. toggles do onboarding). Unificamos em um único
 * enum de tipos; "Iniciação científica" é representada como BOLSA
 * com área correspondente.
 */

export const TIPOS = [
  "bolsa",
  "edital",
  "estagio",
  "evento",
  "intercambio",
  "concurso",
] as const;
export type Tipo = (typeof TIPOS)[number];

export const TIPO_LABELS: Record<Tipo, string> = {
  bolsa: "Bolsa",
  edital: "Edital",
  estagio: "Estágio",
  evento: "Evento",
  intercambio: "Intercâmbio",
  concurso: "Concurso",
};

export const AREAS = [
  "tecnologia",
  "biologicas",
  "humanas",
  "exatas",
  "sociais-aplicadas",
  "meio-ambiente",
  "artes-design",
  "saude",
  "empreendedorismo",
] as const;
export type Area = (typeof AREAS)[number];

export const AREA_LABELS: Record<Area, string> = {
  tecnologia: "Tecnologia",
  biologicas: "Biológicas",
  humanas: "Humanas",
  exatas: "Exatas",
  "sociais-aplicadas": "Sociais Aplicadas",
  "meio-ambiente": "Meio Ambiente",
  "artes-design": "Artes e Design",
  saude: "Saúde",
  empreendedorismo: "Empreendedorismo",
};

export const MODALIDADES = ["presencial", "remoto", "hibrido"] as const;
export type Modalidade = (typeof MODALIDADES)[number];

export const MODALIDADE_LABELS: Record<Modalidade, string> = {
  presencial: "Presencial",
  remoto: "Remoto",
  hibrido: "Híbrido",
};

/** Papéis de usuário. Admins podem gerenciar oportunidades manualmente. */
export const ROLES = ["user", "admin"] as const;
export type Role = (typeof ROLES)[number];

/**
 * Contrato de ingestão: o que o serviço de scraping envia para a API.
 * Mudanças aqui exigem atualizar apps/scraper/app/schemas.py em conjunto.
 */
export interface OpportunityIngestDto {
  tipo: Tipo;
  titulo: string;
  descricao: string;
  urlOrigem: string;
  fonte: string;
  instituicao?: string;
  prazoInscricao?: string; // ISO 8601 (YYYY-MM-DD)
  modalidade?: Modalidade;
  local?: string;
  valorBolsa?: string;
  requisitos?: string[];
  areas?: Area[];
}

export interface OpportunityDto extends Omit<OpportunityIngestDto, "requisitos" | "areas"> {
  id: string;
  requisitos: string[];
  areas: Area[];
  coletadoEm: string;
  salvo?: boolean;
}

export interface UserPreferencesDto {
  areas: Area[];
  tipos: Tipo[];
}
