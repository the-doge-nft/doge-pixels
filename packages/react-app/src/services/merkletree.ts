import { keccak256 } from "ethers/lib/utils";
import { MerkleTree } from "merkletreejs";

export const getProof = (leaf: string, whitelist: string[]) => {
  if (whitelist.length == 0) {
    throw new Error("Cannot compute whitelist");
  }
  const leaves = whitelist.map(address => keccak256(address));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  return tree.getHexProof(keccak256(leaf));
};
