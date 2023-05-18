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
    address public DOG_20_FEE_ADDRESS_V2;
    uint256 public DOG_20_FEE_AMOUNT_V2;

    function setAdmin(address _admin) public {
        require(!v2Initialized);
        admin = _admin;
        v2Initialized;
    }

    /**
     * @dev Base URI for computing {tokenURI}.
     */
    function setBaseURI(string memory uri) public {
        require(_msgSender() == admin, "Only admin can set base URI");
        BASE_URI = uri;
    }

    function setFeeAddress(address _feeAddress) public {
        require(_msgSender() == admin, "Only admin can set the fee address");
        DOG_20_FEE_ADDRESS_V2 = _feeAddress;
    }

    function setFeeAmount(uint256 _feeAmount) public {
        require(_msgSender() == admin, "Only admin can set the fee amount");
        DOG_20_FEE_AMOUNT_V2 = _feeAmount;
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

    function processCollateralAfterBurn(uint256 totalAmount) internal override {
        // transfer collateral to the burner
        // 1% is taken for fees, from that FEES_AMOUNT_DEV AND FEES_AMOUNT_PLEASR are distributed between developers and PleasrDAO
        uint256 feeAmount = (totalAmount * DOG_20_FEE_AMOUNT_V2) / 100 / 100;
        uint256 burnerAmount = totalAmount - feeAmount;
        DOG20.transfer(DOG_20_FEE_ADDRESS_V2, feeAmount);
        DOG20.transfer(_msgSender(), burnerAmount);
    }
}
