import { Test, TestingModule } from '@nestjs/testing';
import { CodeEthicsService } from './code-ethics.service';
import { getModelToken } from '@nestjs/mongoose';

describe('CodeEthicsService', () => {
  let service: CodeEthicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeEthicsService,
        { provide: getModelToken('CodeEthics'), useValue: {} },
      ],
    }).compile();

    service = module.get<CodeEthicsService>(CodeEthicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
