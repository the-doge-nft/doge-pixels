export enum Events {
  ETHERS_WS_PROVIDER_CONNECTED = 'ETHERS_WS_PROVIDER_CONNECTED',
  PIXEL_MINT_OR_BURN = 'PIXEL_MINT_OR_BURN'
}

export interface PixelMintOrBurnPayload {
  from: string;
  to: string;
  tokenId: number;
  blockNumber: number;
}
