import { Test, TestingModule } from '@nestjs/testing';
import { PlanWorkService } from './plan-work.service';
import { getModelToken } from '@nestjs/mongoose';

describe('PlanWorkService', () => {
  let service: PlanWorkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanWorkService,
        { provide: getModelToken('PlanWorkGrandParent'), useValue: {} },
        { provide: getModelToken('PlanWorkParent'), useValue: {} },
        { provide: getModelToken('PlanWorkChild'), useValue: {} },
      ],
    }).compile();

    service = module.get<PlanWorkService>(PlanWorkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
