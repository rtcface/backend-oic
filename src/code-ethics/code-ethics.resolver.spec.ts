import { Test, TestingModule } from '@nestjs/testing';
import { CodeEthicsResolver } from './code-ethics.resolver';
import { CodeEthicsService } from './code-ethics.service';

describe('CodeEthicsResolver', () => {
  let resolver: CodeEthicsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeEthicsResolver,
        { provide: CodeEthicsService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<CodeEthicsResolver>(CodeEthicsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
