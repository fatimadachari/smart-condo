import { Test, TestingModule } from '@nestjs/testing';
import { CondominiosController } from './condominios.controller';
import { CondominiosService } from './condominios.service';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

describe('CondominiosController', () => {
  let controller: CondominiosController;
  let service: CondominiosService;

  const mockCondominiosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CondominiosController],
      providers: [
        {
          provide: CondominiosService,
          useValue: mockCondominiosService,
        },
      ],
    }).compile();

    controller = module.get<CondominiosController>(CondominiosController);
    service = module.get<CondominiosService>(CondominiosService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um condomínio', async () => {
      const createDto = { nome: 'Residencial Teste', endereco: 'Rua Teste, 123' };
      const mockResult = { id: '123', ...createDto, criadoEm: new Date() };

      mockCondominiosService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de condomínios', async () => {
      const mockPaginated = new PaginatedResponseDto(
        [{ id: '1', nome: 'Teste', endereco: null, criadoEm: new Date() }],
        1,
        10,
        1,
      );

      mockCondominiosService.findAll.mockResolvedValue(mockPaginated);

      const result = await controller.findAll({ page: 1, perPage: 10 });

      expect(result).toEqual(mockPaginated);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, perPage: 10 });
    });
  });

  describe('findOne', () => {
    it('deve retornar um condomínio por ID', async () => {
      const mockCondominio = {
        id: '123',
        nome: 'Residencial Teste',
        endereco: null,
        criadoEm: new Date(),
      };

      mockCondominiosService.findOne.mockResolvedValue(mockCondominio);

      const result = await controller.findOne('123');

      expect(result).toEqual(mockCondominio);
      expect(service.findOne).toHaveBeenCalledWith('123');
    });
  });

  describe('update', () => {
    it('deve atualizar um condomínio', async () => {
      const updateDto = { nome: 'Nome Atualizado' };
      const mockResult = {
        id: '123',
        nome: 'Nome Atualizado',
        endereco: null,
        criadoEm: new Date(),
      };

      mockCondominiosService.update.mockResolvedValue(mockResult);

      const result = await controller.update('123', updateDto);

      expect(result).toEqual(mockResult);
      expect(service.update).toHaveBeenCalledWith('123', updateDto);
    });
  });

  describe('remove', () => {
    it('deve remover um condomínio sem força', async () => {
      mockCondominiosService.remove.mockResolvedValue(undefined);

      await controller.remove('123', 'false');

      expect(service.remove).toHaveBeenCalledWith('123', false);
    });

    it('deve remover um condomínio com força', async () => {
      mockCondominiosService.remove.mockResolvedValue(undefined);

      await controller.remove('123', 'true');

      expect(service.remove).toHaveBeenCalledWith('123', true);
    });
  });
});