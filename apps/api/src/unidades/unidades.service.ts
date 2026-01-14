import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { prisma } from '@smart-condo/database';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';
import { UnidadeResponseDto } from './dto/unidade-response.dto';

@Injectable()
export class UnidadesService {

  private mapToDto(unidade: any): UnidadeResponseDto {
    return {
      id: unidade.id,
      identificacao: unidade.numero, 
      bloco: unidade.bloco,
      condominioId: unidade.condominioId,
      criadoEm: unidade.criadoEm,
    };
  }

  async create(data: CreateUnidadeDto): Promise<UnidadeResponseDto> {
    const condominioExists = await prisma.condominio.findUnique({
      where: { id: data.condominioId }
    });

    if (!condominioExists) {
      throw new NotFoundException('Condomínio informado não existe.');
    }

    try {
      const unidade = await prisma.unidade.create({
        data: {
          numero: data.identificacao,
          bloco: data.bloco,
          condominioId: data.condominioId,
        },
      });

      return this.mapToDto(unidade);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma unidade com esta identificação neste condomínio.');
      }
      throw new InternalServerErrorException('Erro ao criar unidade.');
    }
  }

  async findAll(): Promise<UnidadeResponseDto[]> {
    const unidades = await prisma.unidade.findMany({
      orderBy: { numero: 'asc' },
    });
    return unidades.map(u => this.mapToDto(u));
  }

  async findOne(id: string): Promise<UnidadeResponseDto> {
    const unidade = await prisma.unidade.findUnique({ where: { id } });

    if (!unidade) {
      throw new NotFoundException(`Unidade com ID ${id} não encontrada.`);
    }

    return this.mapToDto(unidade);
  }

  async update(id: string, data: UpdateUnidadeDto): Promise<UnidadeResponseDto> {
    await this.findOne(id);

    const dataToUpdate: any = {
      bloco: data.bloco,
      condominioId: data.condominioId
    };

    if (data.identificacao) {
      dataToUpdate.numero = data.identificacao;
    }

    try {
      const updated = await prisma.unidade.update({
        where: { id },
        data: dataToUpdate,
      });
      return this.mapToDto(updated);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma unidade com esta identificação.');
      }
      throw new InternalServerErrorException('Erro ao atualizar unidade.');
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await prisma.unidade.delete({ where: { id } });
  }
}