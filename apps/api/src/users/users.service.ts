import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { prisma } from '@smart-condo/database';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  
  private mapToDto(user: any): UserResponseDto {
    return {
      id: user.id,
      name: user.nome,
      email: user.email,
      role: user.tipo,
      condominioId: user.condominioId,
      unidadeId: user.unidadeId,
      criadoEm: user.criadoEm,
    };
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    if (!data.condominioId) {
        throw new BadRequestException('O ID do condomínio é obrigatório para cadastro.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          nome: data.name,
          email: data.email,
          senha: hashedPassword,
          tipo: data.role,
          condominioId: data.condominioId!, 
          unidadeId: data.unidadeId, 
        },
      });

      return this.mapToDto(user);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Este e-mail já está cadastrado.');
      }
      console.error(error); 
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await prisma.user.findMany({
      orderBy: { nome: 'asc' },
    });
    return users.map(user => this.mapToDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.mapToDto(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    await this.findOne(id);

    const dataToUpdate: any = {};
    if (data.name) dataToUpdate.nome = data.name;
    if (data.email) dataToUpdate.email = data.email;
    if (data.role) dataToUpdate.tipo = data.role;
    if (data.condominioId) dataToUpdate.condominioId = data.condominioId;
    if (data.unidadeId) dataToUpdate.unidadeId = data.unidadeId;
    
    if (data.password) {
      dataToUpdate.senha = await bcrypt.hash(data.password, 10);
    }

    try {
      const user = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });
      return this.mapToDto(user);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('E-mail já está em uso.');
      }
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    try {
        await prisma.user.delete({ where: { id } });
    } catch (error) {
        throw new InternalServerErrorException('Erro ao remover usuário.');
    }
  }
}