// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PX.sol";

/**
 * @title PXMock
 * This mock just provides a public safeMint, mint, and burn functions for testing purposes
 */
contract PXMock_V3 is PX {

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

    function V3() view public returns (string memory){
        return "Hello V3!";
    }

//
//    //
//    // mintPuppers
//    //
//    // Description:
//    // GET SOME PIXELS!
//    // Specify amount of pixels you wish to receive. Your ETH address must entrust our contract of handling your
//    // $DOG balance beforehand. You can open your $DOG balance for us with calling `approve` on the $DOG token contract.
//    //
//    function mintPuppers(uint256 qty) view public override {
//        require(qty > 255, "V3 mintPuppers");
//    }
//
//    /**
//     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
//     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
//     * by default, can be overriden in child contracts.
//     */
//    function _baseURI() internal view virtual override returns (string memory){
//        return "https://test-v3-base-uri/";
//    }
//
//    //
//    // tokenURI
//    //
//    // Description:
//    // TokenUri as x_y
//    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
//        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
//
//        string memory baseURI = _baseURI();
//        uint256 shard = 1 + (tokenId - INDEX_OFFSET) / 5000;
//        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, "test-new-uri-v3-sh", Strings.toString(shard), "/", "metadata-", Strings.toString(tokenId), ".json")) : "";
//    }
}
