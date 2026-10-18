import { Test, TestingModule } from '@nestjs/testing';
import { ErroresService } from './errores.service.js';

describe('ErroresService', () => {
  let service: ErroresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErroresService],
    }).compile();

    service = module.get<ErroresService>(ErroresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
