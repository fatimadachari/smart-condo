import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { prisma } from '@smart-condo/database';
import { CreateCommonAreaDto } from './dto/create-common-area.dto';
import { UpdateCommonAreaDto } from './dto/update-common-area.dto';
import { CommonAreaResponseDto } from './dto/common-area-response.dto';

@Injectable()
export class CommonAreasService {

  private mapToDto(area: any): CommonAreaResponseDto {
    return area as CommonAreaResponseDto;
  }

  async create(data: CreateCommonAreaDto): Promise<CommonAreaResponseDto> {
    try {
      const area = await prisma.commonArea.create({ data });
      return this.mapToDto(area);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma área comum com este nome.');
      }
      throw new InternalServerErrorException('Erro ao criar área comum.');
    }
  }

  async findAll(): Promise<CommonAreaResponseDto[]> {
    const areas = await prisma.commonArea.findMany({
      orderBy: { name: 'asc' }
    });
    return areas.map(area => this.mapToDto(area));
  }

  async findOne(id: string): Promise<CommonAreaResponseDto> {
    const commonArea = await prisma.commonArea.findUnique({ where: { id } });
    if (!commonArea) {
      throw new NotFoundException(`Área comum com ID ${id} não encontrada.`);
    }
    return this.mapToDto(commonArea);
  }

  async update(id: string, data: UpdateCommonAreaDto): Promise<CommonAreaResponseDto> {
    await this.findOne(id);
    try {
        const updated = await prisma.commonArea.update({
            where: { id },
            data,
        });
        return this.mapToDto(updated);
    } catch (error) {
        throw new InternalServerErrorException('Erro ao atualizar área comum.');
    }
  }

  async remove(id: string, force: boolean = false): Promise<void> {
    await this.findOne(id);

    try {
      if (force) {
        await prisma.$transaction([
          prisma.booking.deleteMany({ where: { commonAreaId: id } }),
          prisma.commonArea.delete({ where: { id } }),
        ]);
      } else {
        await prisma.commonArea.delete({ where: { id } });
      }
    } catch (error) {
      if (error.code === 'P2003') {
        throw new ConflictException('Existem reservas ativas. Use force=true para forçar a exclusão.');
      }
      throw new InternalServerErrorException('Erro ao excluir área comum.');
    }
  }
}