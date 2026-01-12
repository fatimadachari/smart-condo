import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { prisma } from '@smart-condo/database';

@Injectable()
export class AvisosService {

  async create(createAvisoDto: CreateAvisoDto, autorId: string, condominioId: string) {
    return prisma.aviso.create({
      data: {
        titulo: createAvisoDto.titulo,
        descricao: createAvisoDto.descricao,
        
        // CORREÇÃO 1: Usar o tipo que vem do front (ou GERAL se vier vazio)
        tipo: createAvisoDto.tipo || 'GERAL', 
        
        // CORREÇÃO 2: Salvar a Data do Evento (se existir)
        dataEvento: createAvisoDto.dataEvento ? new Date(createAvisoDto.dataEvento) : null,

        // Relacionamentos Obrigatórios
        autorId: autorId,
        condominioId: condominioId
      },
      include: {
        autor: { select: { nome: true, tipo: true } },
      }
    });
  }

  async findAll(condominioId?: string) {
    const where = condominioId ? { condominioId } : {};

    return prisma.aviso.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
      include: {
        autor: { select: { nome: true, tipo: true } },
      }
    });
  }

  async findOne(id: string) {
    const aviso = await prisma.aviso.findUnique({
      where: { id },
      include: {
        autor: { select: { nome: true } }
      }
    });
    if (!aviso) throw new NotFoundException('Aviso não encontrado');
    return aviso;
  }

  async update(id: string, data: CreateAvisoDto) {
    return prisma.aviso.update({
      where: { id },
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        tipo: data.tipo,
        // Conversão de String (DTO) para Date (Banco)
        dataEvento: data.dataEvento ? new Date(data.dataEvento) : null,
      }
    });
  }

  async remove(id: string) {
    return prisma.aviso.delete({ where: { id } });
  }
}