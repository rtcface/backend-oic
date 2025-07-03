import { Test, TestingModule } from '@nestjs/testing';
import { EthicsCommitteResolver } from './ethics-committe.resolver';
import { EthicsCommitteService } from './ethics-committe.service';

describe('EthicsCommitteResolver', () => {
  let resolver: EthicsCommitteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EthicsCommitteResolver,
        { provide: EthicsCommitteService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<EthicsCommitteResolver>(EthicsCommitteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
