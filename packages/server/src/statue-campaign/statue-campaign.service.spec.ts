import { Test, TestingModule } from '@nestjs/testing';
import { StatueCampaignService } from './statue-campaign.service';

describe('RainbowService', () => {
  let service: StatueCampaignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatueCampaignService],
    }).compile();

    service = module.get<StatueCampaignService>(StatueCampaignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
