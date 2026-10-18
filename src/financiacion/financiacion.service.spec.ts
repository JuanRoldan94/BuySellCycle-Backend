import { Test, TestingModule } from '@nestjs/testing';
import { FinanciacionService } from './financiacion.service.js';

describe('FinanciacionService', () => {
  let service: FinanciacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinanciacionService],
    }).compile();

    service = module.get<FinanciacionService>(FinanciacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
