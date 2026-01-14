import { Test, TestingModule } from '@nestjs/testing';
import { CommonAreasController } from './common-areas.controller';
import { CommonAreasService } from './common-areas.service';
import { ConflictException } from '@nestjs/common';
import { CreateCommonAreaDto } from './dto/create-common-area.dto';

describe('CommonAreasController', () => {
  let controller: CommonAreasController;
  let service: CommonAreasService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockArea = { 
    id: '1', 
    name: 'Salão de Festas', 
    createdAt: new Date(), 
    updatedAt: new Date() 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonAreasController],
      providers: [
        {
          provide: CommonAreasService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CommonAreasController>(CommonAreasController);
    service = module.get<CommonAreasService>(CommonAreasService);
    
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma nova área comum', async () => {
      const dto: CreateCommonAreaDto = { name: 'Salão de Festas' };
      mockService.create.mockResolvedValue(mockArea);

      const result = await controller.create(dto);

      expect(result).toEqual(mockArea);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de áreas comuns', async () => {
      mockService.findAll.mockResolvedValue([mockArea]);

      const result = await controller.findAll();

      expect(result).toEqual([mockArea]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma área comum pelo ID', async () => {
      mockService.findOne.mockResolvedValue(mockArea);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockArea);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('deve atualizar uma área comum', async () => {
      const dto = { name: 'Novo Nome' };
      mockService.update.mockResolvedValue({ ...mockArea, ...dto });

      const result = await controller.update('1', dto);

      expect(result).toEqual({ ...mockArea, name: 'Novo Nome' });
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('deve chamar service.remove com force=true quando query param for "true"', async () => {
      mockService.remove.mockResolvedValue(undefined);
      
      await controller.remove('1', 'true');
      
      expect(service.remove).toHaveBeenCalledWith('1', true);
    });

    it('deve chamar service.remove com force=false quando query param for "false" ou undefined', async () => {
      mockService.remove.mockResolvedValue(undefined);
      
      await controller.remove('1', 'false');
      
      expect(service.remove).toHaveBeenCalledWith('1', false);
    });

    it('deve repassar exceções do service', async () => {
      mockService.remove.mockRejectedValue(new ConflictException('Erro de conflito'));
      
      await expect(controller.remove('1', 'false'))
        .rejects
        .toThrow(ConflictException);
    });
  });
});