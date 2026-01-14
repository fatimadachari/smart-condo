import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query, BadRequestException, Patch, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AvisosService } from './avisos.service';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateAvisoDto } from './dto/update-aviso.dto';
import { AvisoResponseDto } from './dto/aviso-response.dto';

@ApiTags('Avisos')
@ApiBearerAuth('JWT-auth')
@Controller('avisos')
@UseGuards(AuthGuard('jwt'))
export class AvisosController {
  constructor(private readonly avisosService: AvisosService) { }

  @Post()
  @ApiOperation({ summary: 'Criar novo aviso' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AvisoResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Usuário sem condomínio vinculado.' })
  create(@Body() createAvisoDto: CreateAvisoDto, @Request() req): Promise<AvisoResponseDto> {
    const userId = req.user.userId || req.user.id || req.user.sub;
    const condominioId = req.user.condominioId;

    if (!condominioId) {
      throw new BadRequestException('Usuário não vinculado a um condomínio');
    }

    return this.avisosService.create(createAvisoDto, userId, condominioId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar avisos' })
  @ApiQuery({ name: 'condominioId', required: false, description: 'Filtrar avisos por condomínio específico' })
  @ApiResponse({ status: HttpStatus.OK, type: [AvisoResponseDto] })
  findAll(@Query('condominioId') condominioId?: string): Promise<AvisoResponseDto[]> {
    return this.avisosService.findAll(condominioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar aviso' })
  @ApiParam({ name: 'id', example: 'uuid-do-aviso' })
  @ApiResponse({ status: HttpStatus.OK, type: AvisoResponseDto })
  update(@Param('id') id: string, @Body() updateAvisoDto: UpdateAvisoDto): Promise<AvisoResponseDto> {
    return this.avisosService.update(id, updateAvisoDto);
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir aviso' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Aviso excluído.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.avisosService.remove(id);
  }
}