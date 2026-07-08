import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { TIPOS } from "@academic-pinpoint/shared";

export class FindOpportunitiesQuery {
  @IsOptional()
  @IsIn(TIPOS)
  tipo?: string;

  /** Uma ou mais áreas separadas por vírgula: ?areas=tecnologia,saude */
  @IsOptional()
  @Transform(({ value }) =>
    String(value)
      .split(",")
      .map((a: string) => a.trim())
      .filter(Boolean),
  )
  areas?: string[];

  @IsOptional()
  @IsString()
  q?: string;

  /** Quando true e houver usuário logado, aplica as preferências do onboarding */
  @IsOptional()
  @Transform(({ value }) => value === "true" || value === "1")
  @IsBoolean()
  personalizado?: boolean;

  /** Por padrão só oportunidades com prazo aberto (ou sem prazo) */
  @IsOptional()
  @Transform(({ value }) => !(value === "false" || value === "0"))
  @IsBoolean()
  apenasAbertas?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize?: number;
}
