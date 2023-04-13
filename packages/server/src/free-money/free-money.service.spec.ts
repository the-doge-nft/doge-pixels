import { Test, TestingModule } from '@nestjs/testing';
import { FreeMoneyService } from './free-money.service';

describe('FreeMoneyService', () => {
  let service: FreeMoneyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreeMoneyService],
    }).compile();

    service = module.get<FreeMoneyService>(FreeMoneyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
