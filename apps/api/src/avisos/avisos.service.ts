import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { prisma } from '@smart-condo/database';
import { CreateAvisoDto, TipoAviso } from './dto/create-aviso.dto'; // Importe o Enum aqui!
import { UpdateAvisoDto } from './dto/update-aviso.dto';
import { AvisoResponseDto } from './dto/aviso-response.dto';

@Injectable()
export class AvisosService {

  private mapToDto(aviso: any): AvisoResponseDto {
    return {
      ...aviso,
      tipo: aviso.tipo as TipoAviso, 
    };
  }

  async create(data: CreateAvisoDto, autorId: string, condominioId: string): Promise<AvisoResponseDto> {
    try {
      const aviso = await prisma.aviso.create({
        data: {
          titulo: data.titulo,
          descricao: data.descricao,
          tipo: data.tipo || TipoAviso.GERAL,
          dataEvento: data.dataEvento ? new Date(data.dataEvento) : null,
          autorId,
          condominioId
        },
      });
      
      return this.mapToDto(aviso); 
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar aviso.');
    }
  }

  async findAll(condominioId?: string): Promise<AvisoResponseDto[]> {
    const where = condominioId ? { condominioId } : {};
    const avisos = await prisma.aviso.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
    });
    
    return avisos.map(aviso => this.mapToDto(aviso)); 
  }

  async findOne(id: string): Promise<AvisoResponseDto> {
    const aviso = await prisma.aviso.findUnique({ where: { id } });
    if (!aviso) throw new NotFoundException('Aviso não encontrado');
    
    return this.mapToDto(aviso); 
  }

  async update(id: string, data: UpdateAvisoDto): Promise<AvisoResponseDto> {
    await this.findOne(id);

    const dataToUpdate: any = { ...data };
    if (data.dataEvento) {
        dataToUpdate.dataEvento = new Date(data.dataEvento);
    }

    try {
      const aviso = await prisma.aviso.update({
        where: { id },
        data: dataToUpdate,
      });
      
      return this.mapToDto(aviso); 
    } catch (error) {
        throw new InternalServerErrorException('Erro ao atualizar aviso.');
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await prisma.aviso.delete({ where: { id } });
  }
}