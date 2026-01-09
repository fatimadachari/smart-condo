import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from '@smart-condo/database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  
  async create(data: CreateUserDto) {
    // 1. Verificar se o e-mail já existe
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    // 2. Verificar se o Condomínio existe (Regra de consistência)
    const condominioExists = await prisma.condominio.findUnique({
      where: { id: data.condominioId }
    });

    if (!condominioExists) {
      throw new NotFoundException('O condomínio informado não existe.');
    }

    // 3. Criptografar a senha (Hash)
    const salt = await bcrypt.genSalt(10); // O "tempero" da criptografia
    const hashedPassword = await bcrypt.hash(data.senha, salt);

    // 4. Salvar no banco
    try {
      const user = await prisma.user.create({
        data: {
          ...data,
          senha: hashedPassword, // Salvamos o hash, NUNCA a senha original
        },
      });

      // Remover a senha do objeto de retorno (Segurança)
      const { senha, ...result } = user;
      return result;

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  async findAll() {
    // Ao listar, nunca retornamos as senhas!
    return await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        condominio: { select: { nome: true } } // Já trazemos o nome do condomínio junto
      }
    });
  }

  // ... (implementaremos findOne, update e remove depois)
  findOne(id: number) { return `This action returns a #${id} user`; }
  update(id: number, updateUserDto: UpdateUserDto) { return `This action updates a #${id} user`; }
  remove(id: number) { return `This action removes a #${id} user`; }
}