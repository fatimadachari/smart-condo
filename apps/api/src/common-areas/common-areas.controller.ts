import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommonAreasService } from './common-areas.service';
import { CreateCommonAreaDto } from './dto/create-common-area.dto';
import { UpdateCommonAreaDto } from './dto/update-common-area.dto';
import { CommonAreaResponseDto } from './dto/common-area-response.dto';

@ApiTags('Áreas Comuns')
@ApiBearerAuth('JWT-auth')
@Controller('common-areas')
@UseGuards(AuthGuard('jwt'))
export class CommonAreasController {
  constructor(private readonly commonAreasService: CommonAreasService) { }

  @Post()
  @ApiOperation({ summary: 'Cadastrar área comum' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CommonAreaResponseDto })
  create(@Body() createCommonAreaDto: CreateCommonAreaDto): Promise<CommonAreaResponseDto> {
    return this.commonAreasService.create(createCommonAreaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar áreas comuns' })
  @ApiResponse({ status: HttpStatus.OK, type: [CommonAreaResponseDto] })
  findAll(): Promise<CommonAreaResponseDto[]> {
    return this.commonAreasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar área comum por ID' })
  @ApiResponse({ status: HttpStatus.OK, type: CommonAreaResponseDto })
  findOne(@Param('id') id: string): Promise<CommonAreaResponseDto> {
    return this.commonAreasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar área comum' })
  @ApiResponse({ status: HttpStatus.OK, type: CommonAreaResponseDto })
  update(@Param('id') id: string, @Body() updateCommonAreaDto: UpdateCommonAreaDto): Promise<CommonAreaResponseDto> {
    return this.commonAreasService.update(id, updateCommonAreaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir área comum' })
  @ApiQuery({ name: 'force', required: false, type: Boolean, description: 'Forçar exclusão removendo reservas associadas' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Existem reservas ativas (use force=true).' })
  remove(@Param('id') id: string, @Query('force') force: string): Promise<void> {
    const isForce = force === 'true';
    return this.commonAreasService.remove(id, isForce);
  }
}