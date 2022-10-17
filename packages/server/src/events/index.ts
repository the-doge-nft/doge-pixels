import { Event } from '@ethersproject/contracts/src.ts/index';

export enum Events {
  ETHERS_WS_PROVIDER_CONNECTED = 'ETHERS_WS_PROVIDER_CONNECTED',
  PIXEL_TRANSFER = 'PIXEL_TRANSFER',
}

export interface PixelTransferEventPayload {
  from: string;
  to: string;
  tokenId: number;
  blockNumber: number;
  blockCreatedAt: Date;
  event: Event;
}
