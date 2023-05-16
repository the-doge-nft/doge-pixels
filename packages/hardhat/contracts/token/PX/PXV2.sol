// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PX.sol";

/**
 * @title PXV2
 *
 * This version of the Doge Pixels contract changes the follow
 *  - uri of the tokens as additional metadata attributes were required to be added
 *  - processing collateral when burning as all fees were required to go to the daoge directly
 */
contract PXV2 is PX {
    address public admin;
    bool public v2Initialized;

    function setAdmin(address _admin) public {
        require(!v2Initialized);
        admin = _admin;
        v2Initialized;
    }

    //
    // tokenURI
    //
    // Description:
    // TokenUri as x_y
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, Strings.toString(tokenId)))
                : "";
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function setBaseURI(string memory uri) public {
        require(_msgSender() == admin, "Only admin can set base URI");
        BASE_URI = uri;
    }
}
