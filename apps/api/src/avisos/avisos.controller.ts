import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query, BadRequestException, Patch } from '@nestjs/common';
import { AvisosService } from './avisos.service';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('avisos')
@UseGuards(AuthGuard('jwt'))
export class AvisosController {
  constructor(private readonly avisosService: AvisosService) { }

  @Post()
  create(@Body() createAvisoDto: CreateAvisoDto, @Request() req) {
    // 1. Pega o ID do usuário (autor)
    const userId = req.user.userId || req.user.id || req.user.sub;

    // 2. Pega o ID do condomínio (assumindo que está no payload do JWT)
    // Se o seu JWT não tiver isso, você terá que buscar o usuário no banco antes.
    const condominioId = req.user.condominioId;

    if (!condominioId) {
      // Caso o usuário seja um super-admin ou algo errado com o token
      throw new BadRequestException('Usuário não vinculado a um condomínio');
    }

    // 3. Passa os 3 argumentos para o service
    return this.avisosService.create(createAvisoDto, userId, condominioId);
  }

  @Get()
  findAll(@Query('condominioId') condominioId?: string) {
    return this.avisosService.findAll(condominioId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvisoDto: CreateAvisoDto) {
    return this.avisosService.update(id, updateAvisoDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avisosService.remove(id);
  }
}