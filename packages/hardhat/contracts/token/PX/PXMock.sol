// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PX.sol";

/**
 * @title PXMock
 * This mock just provides a public safeMint, mint, and burn functions for testing purposes
 */
contract PXMock is PX {
    constructor(string memory name_, string memory symbol_, address DOG20Address) PX(name_, symbol_, DOG20Address) {}

    function setSupply(uint256 amount) public {
        puppersRemaining = amount;
        totalSupply = amount;
        for(uint256 i = 0; i < totalSupply; ++i){
            indexToPupper[i] = i;
        }
    }

    function setDOG_TO_PIXEL_SATOSHIS(uint256 amount) public {
        DOG_TO_PIXEL_SATOSHIS = amount;
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }

    function safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public {
        _safeMint(to, tokenId, _data);
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}
