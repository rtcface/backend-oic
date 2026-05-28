import { Test, TestingModule } from '@nestjs/testing';
import { KpisResolver } from './kpis.resolver';
import { KpisService } from './kpis.service';

describe('KpisResolver', () => {
  let resolver: KpisResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KpisResolver, { provide: KpisService, useValue: {} }],
    }).compile();

    resolver = module.get<KpisResolver>(KpisResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
