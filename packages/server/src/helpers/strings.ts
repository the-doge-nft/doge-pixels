import { ethers } from 'ethers';

export function formatAddress(address: string) {
  return ethers.utils.getAddress(address);
}
