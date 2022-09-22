import { Test, TestingModule } from '@nestjs/testing';
import { NomicsService } from './nomics.service';

describe('NomicsService', () => {
  let service: NomicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NomicsService],
    }).compile();

    service = module.get<NomicsService>(NomicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
