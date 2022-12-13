import { Test, TestingModule } from '@nestjs/testing';
import { ChainanalysisService } from './chainanalysis.service';

describe('ChainanalysisService', () => {
  let service: ChainanalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChainanalysisService],
    }).compile();

    service = module.get<ChainanalysisService>(ChainanalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
