import { Test, TestingModule } from '@nestjs/testing';
import { IntegrityRulesService } from './integrity-rules.service';
import { getModelToken } from '@nestjs/mongoose';

describe('IntegrityRulesService', () => {
  let service: IntegrityRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrityRulesService,
        { provide: getModelToken('IntegrityRule'), useValue: {} },
        { provide: getModelToken('HistoryRules'), useValue: {} },
      ],
    }).compile();

    service = module.get<IntegrityRulesService>(IntegrityRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
