import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserResponse: UserResponseDto = {
    id: 'user-uuid-123',
    name: 'Ana Teste',
    email: 'ana@teste.com',
    role: UserRole.MORADOR,
    condominioId: 'cond-uuid-123',
    unidadeId: 'uni-uuid-123',
    criadoEm: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      const createDto: CreateUserDto = {
        name: 'Ana Teste',
        email: 'ana@teste.com',
        password: 'SenhaForte123',
        role: UserRole.MORADOR,
        condominioId: 'cond-uuid-123',
      };

      mockUsersService.create.mockResolvedValue(mockUserResponse);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockUserResponse);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de usuários', async () => {
      const mockList = [mockUserResponse];
      mockUsersService.findAll.mockResolvedValue(mockList);

      const result = await controller.findAll();

      expect(result).toEqual(mockList);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário pelo ID', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUserResponse);

      const result = await controller.findOne('user-uuid-123');

      expect(result).toEqual(mockUserResponse);
      expect(service.findOne).toHaveBeenCalledWith('user-uuid-123');
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário', async () => {
      const updateDto: UpdateUserDto = { name: 'Ana Atualizada' };
      const updatedUser = { ...mockUserResponse, name: 'Ana Atualizada' };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('user-uuid-123', updateDto);

      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith('user-uuid-123', updateDto);
    });
  });

  describe('remove', () => {
    it('deve remover um usuário', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('user-uuid-123');

      expect(service.remove).toHaveBeenCalledWith('user-uuid-123');
    });
  });
});