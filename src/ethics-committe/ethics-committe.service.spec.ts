import { Test, TestingModule } from '@nestjs/testing';
import { EthicsCommitteService } from './ethics-committe.service';
import { getModelToken } from '@nestjs/mongoose';

describe('EthicsCommitteService', () => {
  let service: EthicsCommitteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EthicsCommitteService,
        { provide: getModelToken('Committe'), useValue: {} },
      ],
    }).compile();

    service = module.get<EthicsCommitteService>(EthicsCommitteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
