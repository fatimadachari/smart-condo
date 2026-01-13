import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Total de itens por página',
    example: 10,
  })
  perPage: number;

  @ApiProperty({
    description: 'Total de itens encontrados',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 5,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Indica se há próxima página',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Indica se há página anterior',
    example: false,
  })
  hasPrevPage: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array de dados da página atual',
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Metadados da paginação',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  constructor(data: T[], page: number, perPage: number, total: number) {
    this.data = data;
    
    const totalPages = Math.ceil(total / perPage);
    
    this.meta = {
      page,
      perPage,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}