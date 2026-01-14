import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UnidadesService } from './unidades.service';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';
import { UnidadeResponseDto } from './dto/unidade-response.dto';

@ApiTags('Unidades')
@ApiBearerAuth('JWT-auth')
@Controller('unidades')
@UseGuards(AuthGuard('jwt'))
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar unidade' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UnidadeResponseDto })
  create(@Body() createUnidadeDto: CreateUnidadeDto): Promise<UnidadeResponseDto> {
    return this.unidadesService.create(createUnidadeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as unidades' })
  @ApiResponse({ status: HttpStatus.OK, type: [UnidadeResponseDto] })
  findAll(): Promise<UnidadeResponseDto[]> {
    return this.unidadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar unidade por ID' })
  @ApiResponse({ status: HttpStatus.OK, type: UnidadeResponseDto })
  findOne(@Param('id') id: string): Promise<UnidadeResponseDto> {
    return this.unidadesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar unidade' })
  @ApiResponse({ status: HttpStatus.OK, type: UnidadeResponseDto })
  update(@Param('id') id: string, @Body() updateUnidadeDto: UpdateUnidadeDto): Promise<UnidadeResponseDto> {
    return this.unidadesService.update(id, updateUnidadeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir unidade' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  remove(@Param('id') id: string): Promise<void> {
    return this.unidadesService.remove(id);
  }
}