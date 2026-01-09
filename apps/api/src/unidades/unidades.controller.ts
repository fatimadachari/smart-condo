import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnidadesService } from './unidades.service';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';

@Controller('unidades')
@UseGuards(AuthGuard('jwt'))
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Post()
  create(@Body() createUnidadeDto: CreateUnidadeDto) {
    return this.unidadesService.create(createUnidadeDto);
  }

  @Get()
  findAll() {
    return this.unidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnidadeDto: UpdateUnidadeDto) {
    return this.unidadesService.update(id, updateUnidadeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.unidadesService.remove(id);
  }
}