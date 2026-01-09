import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { UpdateUnidadeDto } from './dto/update-unidade.dto';
import { prisma } from '@smart-condo/database';

@Injectable()
export class UnidadesService {

  // Função auxiliar para adaptar o retorno do Banco (numero) para o Front (identificacao)
  private mapToFrontend(unidade: any) {
    return {
      ...unidade,
      identificacao: unidade.numero, // O front espera 'identificacao'
    };
  }

  async create(data: CreateUnidadeDto) {
    const condominioExists = await prisma.condominio.findUnique({
      where: { id: data.condominioId }
    });

    if (!condominioExists) {
      throw new NotFoundException('Condomínio informado não existe.');
    }

    try {
      // AQUI ESTÁ A CORREÇÃO: Mapeamos manualmete data.identificacao -> numero
      const created = await prisma.unidade.create({
        data: {
          numero: data.identificacao, // <--- TRADUÇÃO AQUI
          bloco: data.bloco,
          condominioId: data.condominioId,
        },
        include: {
          condominio: true,
        },
      });

      return this.mapToFrontend(created);

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma unidade com esta identificação neste condomínio.');
      }
      throw new InternalServerErrorException('Erro ao criar unidade.');
    }
  }

  async findAll() {
    const unidades = await prisma.unidade.findMany({
      include: {
        condominio: true,
      },
      orderBy: {
        numero: 'asc', // <--- CORREÇÃO DO ERRO DE ORDENAÇÃO (Usar 'numero')
      },
    });

    // Mapeia a lista inteira para o formato que o front espera
    return unidades.map(u => this.mapToFrontend(u));
  }

  async findOne(id: string) {
    const unidade = await prisma.unidade.findUnique({
      where: { id },
      include: {
        condominio: true,
      },
    });

    if (!unidade) {
      throw new NotFoundException(`Unidade com ID ${id} não encontrada.`);
    }

    return this.mapToFrontend(unidade);
  }

  async update(id: string, data: UpdateUnidadeDto) {
    // Verifica se existe
    await this.findOne(id);

    try {
      // Prepara o objeto de atualização
      const dataToUpdate: any = {
        bloco: data.bloco,
        condominioId: data.condominioId
      };

      // Só atualiza o numero se vier a identificacao
      if (data.identificacao) {
        dataToUpdate.numero = data.identificacao;
      }

      const updated = await prisma.unidade.update({
        where: { id },
        data: dataToUpdate,
        include: {
          condominio: true,
        },
      });

      return this.mapToFrontend(updated);

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Já existe uma unidade com esta identificação neste condomínio.');
      }
      throw new InternalServerErrorException('Erro ao atualizar unidade.');
    }
  }

  async remove(id: string) {
    await this.findOne(id); 

    return await prisma.unidade.delete({
      where: { id },
    });
  }
}