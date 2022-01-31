// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC721/ERC721.sol)

pragma solidity ^0.8.0;

import "../ERC721/ERC721.sol";
/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
contract DOG721 is ERC721 {
    uint256 tokenIdCount = 0;
    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor() ERC721("DOG721", "D721") {}

    function initMock(address[] memory holders) public {
        for (uint i = 0; i < holders.length; i++) {
            ++tokenIdCount;
            _safeMint(holders[i], tokenIdCount, '0x42');
        }
    }

}
