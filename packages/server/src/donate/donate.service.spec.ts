import { Test, TestingModule } from '@nestjs/testing';
import { DonateService } from './donate.service';

describe('DonateService', () => {
  let service: DonateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonateService],
    }).compile();

    service = module.get<DonateService>(DonateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
