import { Test, TestingModule } from '@nestjs/testing';
import { IntegrityRulesResolver } from './integrity-rules.resolver';
import { IntegrityRulesService } from './integrity-rules.service';

describe('IntegrityRulesResolver', () => {
  let resolver: IntegrityRulesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrityRulesResolver,
        { provide: IntegrityRulesService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<IntegrityRulesResolver>(IntegrityRulesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
