import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommonAreaDto } from './dto/create-common-area.dto';
import { UpdateCommonAreaDto } from './dto/update-common-area.dto';
import { prisma } from '@smart-condo/database'; // Ajuste o import conforme seu projeto

@Injectable()
export class CommonAreasService {

    async create(data: CreateCommonAreaDto) {
        try {
            return await prisma.commonArea.create({ data });
        } catch (error) {
            // P2002: Unique constraint (caso tenha nomes únicos no futuro)
            if (error.code === 'P2002') throw new ConflictException('Já existe uma área comum com este nome.');
            throw new InternalServerErrorException('Erro ao criar área comum.');
        }
    }

    async findAll() {
        return await prisma.commonArea.findMany({
            orderBy: { name: 'asc' } // Opcional: ordenar alfabeticamente
        });
    }

    async findOne(id: string) {
        const commonArea = await prisma.commonArea.findUnique({
            where: { id },
        });

        if (!commonArea) {
            throw new NotFoundException(`Área comum com ID ${id} não encontrada.`);
        }

        return commonArea;
    }

    async update(id: string, data: UpdateCommonAreaDto) {
        await this.findOne(id); // Garante que existe

        return await prisma.commonArea.update({
            where: { id },
            data,
        });
    }

    async remove(id: string, force: boolean = false) {
        await this.findOne(id); // Garante que existe

        try {
            if (force) {
                // MODO CASCATA MANUAL
                // 1. Apaga todas as reservas dessa área
                // 2. Apaga a área
                return await prisma.$transaction([
                    prisma.booking.deleteMany({ where: { commonAreaId: id } }),
                    prisma.commonArea.delete({ where: { id } }),
                ]);
            } else {
                // MODO SEGURO
                // Se tiver reservas, vai dar erro P2003
                return await prisma.commonArea.delete({
                    where: { id },
                });
            }
        } catch (error) {
            if (error.code === 'P2003') {
                throw new ConflictException(
                    'EXIST_DEPENDENCY' // Front-end deve perguntar: "Existem reservas agendadas. Deseja excluir mesmo assim?"
                );
            }
            console.error(error);
            throw new InternalServerErrorException('Erro ao excluir área comum.');
        }
    }
}