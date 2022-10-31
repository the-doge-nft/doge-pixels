import { Test, TestingModule } from '@nestjs/testing';
import { DonationsRepository } from './donations.repository';

describe('DonationsRepository', () => {
  let service: DonationsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationsRepository],
    }).compile();

    service = module.get<DonationsRepository>(DonationsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
