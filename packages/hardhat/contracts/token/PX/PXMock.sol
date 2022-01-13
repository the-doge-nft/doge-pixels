// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PX.sol";

/**
 * @title PXMock
 * This mock just provides a public safeMint, mint, and burn functions for testing purposes
 */
contract PXMock is PX {

    function __PXMock_init(
        string memory name_,
        string memory symbol_,
        address DOG20Address,
        string memory ipfsUri_,
        uint256 width_,
        uint256 height_,
        address DOG20_FEES_ADDRESS_DEV_,
        address DOG20_FEES_ADDRESS_PLEASR_
    ) public initializer {
        __PX_init(
            name_,
            symbol_,
            DOG20Address,
            ipfsUri_,
            width_,
            height_,
            DOG20_FEES_ADDRESS_DEV_,
            DOG20_FEES_ADDRESS_PLEASR_
        );
    }

    function setSupply(uint256 width, uint256 height) public {
        uint256 amount = width * height;
        puppersRemaining = amount;
        totalSupply = amount;
        SHIBA_WIDTH = width;
        SHIBA_HEIGHT = height;
    }

    function setDOG_TO_PIXEL_SATOSHIS(uint256 amount) public {
        DOG_TO_PIXEL_SATOSHIS = amount;
    }
}
