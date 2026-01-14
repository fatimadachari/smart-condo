import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('deve retornar o resultado do serviço de login', async () => {
    const loginDto = { email: 'a@a.com', senha: '123' };
    const mockResult = { accessToken: 'token', user: {} as any };
    
    mockAuthService.login.mockResolvedValue(mockResult);

    expect(await controller.login(loginDto)).toEqual(mockResult);
    expect(service.login).toHaveBeenCalledWith(loginDto);
  });
});