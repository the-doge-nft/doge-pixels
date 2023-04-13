import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyDripService } from './currency-drip.service';

describe('CurrencyDripService', () => {
  let service: CurrencyDripService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyDripService],
    }).compile();

    service = module.get<CurrencyDripService>(CurrencyDripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
