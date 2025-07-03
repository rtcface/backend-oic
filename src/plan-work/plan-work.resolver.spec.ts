import { Test, TestingModule } from '@nestjs/testing';
import { PlanWorkResolver } from './plan-work.resolver';
import { PlanWorkService } from './plan-work.service';

describe('PlanWorkResolver', () => {
  let resolver: PlanWorkResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanWorkResolver, { provide: PlanWorkService, useValue: {} }],
    }).compile();

    resolver = module.get<PlanWorkResolver>(PlanWorkResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
