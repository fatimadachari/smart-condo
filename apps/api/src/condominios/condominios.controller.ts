import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus, 
  UseGuards, 
  Query 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CondominiosService } from './condominios.service';
import { CreateCondominioDto } from './dto/create-condominio.dto';
import { UpdateCondominioDto } from './dto/update-condominio.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CondominioResponseDto } from './dto/condominio-response.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@ApiTags('Condomínios')
@ApiBearerAuth('JWT-auth')
@Controller('condominios')
@UseGuards(AuthGuard('jwt'))
export class CondominiosController {
    constructor(private readonly condominiosService: CondominiosService) { }

    @Post()
    @ApiOperation({ 
      summary: 'Criar novo condomínio',
      description: 'Cria um novo condomínio no sistema. Requer autenticação JWT.',
    })
    @ApiResponse({ 
      status: HttpStatus.CREATED, 
      description: 'Condomínio criado com sucesso.',
      type: CondominioResponseDto,
    })
    @ApiResponse({ 
      status: HttpStatus.BAD_REQUEST, 
      description: 'Dados inválidos fornecidos.',
    })
    @ApiResponse({ 
      status: HttpStatus.CONFLICT, 
      description: 'Já existe um condomínio com este dado único.',
    })
    @ApiResponse({ 
      status: HttpStatus.UNAUTHORIZED, 
      description: 'Token JWT inválido ou ausente.',
    })
    create(@Body() createCondominioDto: CreateCondominioDto): Promise<CondominioResponseDto> {
        return this.condominiosService.create(createCondominioDto);
    }

    @Get()
    @ApiOperation({ 
      summary: 'Listar condomínios',
      description: 'Retorna lista paginada de condomínios com suporte a busca por nome.',
    })
    @ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Lista de condomínios retornada com sucesso.',
      type: PaginatedResponseDto<CondominioResponseDto>,
    })
    @ApiResponse({ 
      status: HttpStatus.UNAUTHORIZED, 
      description: 'Token JWT inválido ou ausente.',
    })
    findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<CondominioResponseDto>> {
        return this.condominiosService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ 
      summary: 'Buscar condomínio por ID',
      description: 'Retorna os detalhes de um condomínio específico.',
    })
    @ApiParam({
      name: 'id',
      description: 'ID único do condomínio',
      example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Condomínio encontrado com sucesso.',
      type: CondominioResponseDto,
    })
    @ApiResponse({ 
      status: HttpStatus.NOT_FOUND, 
      description: 'Condomínio não encontrado.',
    })
    @ApiResponse({ 
      status: HttpStatus.UNAUTHORIZED, 
      description: 'Token JWT inválido ou ausente.',
    })
    findOne(@Param('id') id: string): Promise<CondominioResponseDto> {
        return this.condominiosService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ 
      summary: 'Atualizar condomínio',
      description: 'Atualiza os dados de um condomínio existente. Todos os campos são opcionais.',
    })
    @ApiParam({
      name: 'id',
      description: 'ID único do condomínio',
      example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Condomínio atualizado com sucesso.',
      type: CondominioResponseDto,
    })
    @ApiResponse({ 
      status: HttpStatus.BAD_REQUEST, 
      description: 'Dados inválidos fornecidos.',
    })
    @ApiResponse({ 
      status: HttpStatus.NOT_FOUND, 
      description: 'Condomínio não encontrado.',
    })
    @ApiResponse({ 
      status: HttpStatus.UNAUTHORIZED, 
      description: 'Token JWT inválido ou ausente.',
    })
    update(
      @Param('id') id: string, 
      @Body() updateCondominioDto: UpdateCondominioDto
    ): Promise<CondominioResponseDto> {
        return this.condominiosService.update(id, updateCondominioDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ 
      summary: 'Excluir condomínio',
      description: 'Exclui um condomínio. Use o parâmetro force=true para excluir mesmo com dependências (cascata).',
    })
    @ApiParam({
      name: 'id',
      description: 'ID único do condomínio',
      example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiQuery({
      name: 'force',
      required: false,
      description: 'Se true, força exclusão em cascata removendo todas as dependências',
      example: false,
      type: Boolean,
    })
    @ApiResponse({ 
      status: HttpStatus.NO_CONTENT, 
      description: 'Condomínio excluído com sucesso.',
    })
    @ApiResponse({ 
      status: HttpStatus.NOT_FOUND, 
      description: 'Condomínio não encontrado.',
    })
    @ApiResponse({ 
      status: HttpStatus.CONFLICT, 
      description: 'Condomínio possui dependências (usuários, unidades, avisos). Use force=true para excluir em cascata.',
    })
    @ApiResponse({ 
      status: HttpStatus.UNAUTHORIZED, 
      description: 'Token JWT inválido ou ausente.',
    })
    remove(@Param('id') id: string, @Query('force') force: string): Promise<void> {
        const isForce = force === 'true';
        return this.condominiosService.remove(id, isForce);
    }
}