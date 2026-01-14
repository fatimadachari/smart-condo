import { Test, TestingModule } from '@nestjs/testing';
import { UnidadesController } from './unidades.controller';
import { UnidadesService } from './unidades.service';
import { UnidadeResponseDto } from './dto/unidade-response.dto';

describe('UnidadesController', () => {
  let controller: UnidadesController;
  let service: UnidadesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponse: UnidadeResponseDto = {
    id: '1',
    identificacao: '101',
    bloco: 'A',
    condominioId: 'c1',
    criadoEm: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnidadesController],
      providers: [{ provide: UnidadesService, useValue: mockService }],
    }).compile();

    controller = module.get<UnidadesController>(UnidadesController);
    service = module.get<UnidadesService>(UnidadesService);
  });

  describe('create', () => {
    it('deve criar unidade', async () => {
      mockService.create.mockResolvedValue(mockResponse);
      const dto = { identificacao: '101', condominioId: 'c1' };
      
      const result = await controller.create(dto);
      expect(result).toEqual(mockResponse);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista', async () => {
      mockService.findAll.mockResolvedValue([mockResponse]);
      expect(await controller.findAll()).toEqual([mockResponse]);
    });
  });
});