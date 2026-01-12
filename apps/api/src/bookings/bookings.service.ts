import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { prisma } from '@smart-condo/database';

@Injectable()
export class BookingsService {

    async create(data: CreateBookingDto) {
        // 1. Definir Data Final (Se não vier, assume 1 hora de duração padrão)
        const startDate = data.date;
        const endDate = data.endDate 
            ? data.endDate 
            : new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hora

        if (endDate <= startDate) {
            throw new BadRequestException('A data de fim deve ser maior que a de início.');
        }

        // 2. Verificar se a Área Comum existe
        const commonArea = await prisma.commonArea.findUnique({
            where: { id: data.commonAreaId, isActive: true }
        });

        if (!commonArea) {
            throw new NotFoundException('Área comum não encontrada ou em manutenção.');
        }

        // 3. REGRA DE OURO: Verificar Conflitos de Horário
        // Procura qualquer reserva que comece antes de terminar a nova E termine depois de começar a nova
        const conflict = await prisma.booking.findFirst({
            where: {
                commonAreaId: data.commonAreaId,
                status: { not: 'CANCELLED' }, // Ignora canceladas
                OR: [
                    {
                        // Começa durante uma reserva existente
                        date: { lte: startDate },
                        endDate: { gt: startDate },
                    },
                    {
                        // Termina durante uma reserva existente
                        date: { lt: endDate },
                        endDate: { gte: endDate },
                    },
                    {
                        // Engloba uma reserva existente (começa antes e termina depois da existente)
                        date: { gte: startDate },
                        endDate: { lte: endDate }
                    }
                ]
            }
        });

        if (conflict) {
            throw new ConflictException('Horário indisponível para esta área.');
        }

        try {
            return await prisma.booking.create({
                data: {
                    ...data,
                    endDate: endDate,
                    status: 'PENDING' // Padrão: Pendente de aprovação
                }
            });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Erro ao criar reserva.');
        }
    }

    async findAll() {
        return await prisma.booking.findMany({
            include: {
                user: { select: { nome: true, email: true } }, // Traz o nome do morador
                commonArea: { select: { name: true } }        // Traz o nome da área
            },
            orderBy: { date: 'desc' }
        });
    }

    async findOne(id: string) {
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                user: true,
                commonArea: true
            }
        });

        if (!booking) {
            throw new NotFoundException(`Reserva com ID ${id} não encontrada.`);
        }

        return booking;
    }

    async update(id: string, data: UpdateBookingDto) {
        await this.findOne(id); // Garante existência

        // OBS: Se alterar datas no update, deveria rodar a verificação de conflito novamente.
        // Para simplificar, assumimos que update aqui é focado em mudar STATUS.
        
        return await prisma.booking.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        
        // Em reservas, "deletar" geralmente é "cancelar", mas aqui vamos deletar o registro
        return await prisma.booking.delete({
            where: { id },
        });
    }
}