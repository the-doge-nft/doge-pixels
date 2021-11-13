// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "../ERC20/ERC20.sol";

contract DOG20 is ERC20 {

    uint256 public DOG_TO_PIXEL_SATOSHIS = 5523989899;

    constructor() ERC20("DOG20", "D20"){
    }

    function initMock(address[] memory holders) public {
        // give 10 pixels worth of mock dog to an address
        for (uint i = 0; i < holders.length; i++) {
            _mint(holders[i], DOG_TO_PIXEL_SATOSHIS * 10);
        }
        _mint(address(this), DOG_TO_PIXEL_SATOSHIS * 10);
    }

}
