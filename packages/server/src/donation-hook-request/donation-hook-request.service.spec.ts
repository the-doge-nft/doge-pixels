import { Test, TestingModule } from '@nestjs/testing';
import { DonationHookRequestService } from './donation-hook-request.service';

describe('DonationHookRequestService', () => {
  let service: DonationHookRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationHookRequestService],
    }).compile();

    service = module.get<DonationHookRequestService>(DonationHookRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
