import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Número da página',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro.' })
  @Min(1, { message: 'A página deve ser no mínimo 1.' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um número inteiro.' })
  @Min(1, { message: 'O limite deve ser no mínimo 1.' })
  @Max(100, { message: 'O limite deve ser no máximo 100.' })
  perPage?: number = 10;

  @ApiPropertyOptional({
    description: 'Buscar por nome do condomínio',
    example: 'Residencial',
  })
  @IsOptional()
  @IsString({ message: 'A busca deve ser um texto.' })
  search?: string;
}