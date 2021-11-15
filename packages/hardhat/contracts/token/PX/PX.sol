// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "../ERC20/ERC20.sol";
import "../ERC721/ERC721.sol";
import "../../access/OwnableUpgradeable.sol";
import "hardhat/console.sol";
import "./ERC721CustomUpgradeable.sol";

contract PX is ERC721CustomUpgradeable, OwnableUpgradeable {
    //    using ERC721Custom for ERC721;
    // Fractional.art ERC20 contract holding $DOG tokens
    IERC20 private DOG20;

    //
    // puppersRemaining
    //
    // Description:
    // Keeps track of available puppers pool size. Divides indexToPupper into subsets:
    // - indexToPupper[1...puppersRemaining] -> available puppers
    // - indexToPupper(puppersRemaining...totalSupply] -> used puppers
    //
    uint256 public puppersRemaining;

    //  PROD:  uint256 public immutable totalSupply;
    uint256 public totalSupply;

    // index => pupper; needed for keeping track of available puppers pool
    mapping(uint256 => uint256) indexToPupper;
    // pupper => index; needed for burning functionality and returning pupper to available pool
    mapping(uint256 => uint256) pupperToIndex;

    // PROD: uint256 immutable DOG_TO_PIXEL_SATOSHIS = 5523989899;
    uint256 public DOG_TO_PIXEL_SATOSHIS;
    // ALL ids & indexes are offset by 1, to be able to use default uint256 value - zero - as null/not initialized flag
    uint256 public INDEX_OFFSET;
    // 0 value is flag for not initialized. There is no pupper with id = 0, and there is no index = 0
    uint256 public MAGIC_NULL;

    function __PX_init(string memory name_, string memory symbol_, address DOG20Address) public initializer {
        __ERC721Custom_init(name_, symbol_);
        require(DOG20Address != address(0));
        DOG20 = IERC20(DOG20Address);
        uint256 _width = 10;
        uint256 _height = 10;
        totalSupply = _width * _height;
        puppersRemaining = _width * _height;

        // Proxy initialization
        // https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#avoid-initial-values-in-field-declarations
        DOG_TO_PIXEL_SATOSHIS = 5523989899;
        INDEX_OFFSET = 1000000;
        MAGIC_NULL = 0;
    }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 tokenId) internal virtual override {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        //        console.log("new pupper");
        //        console.log(pupper);
        _balances[to] += 1;
        _owners[tokenId] = to;
        puppersRemaining -= 1;

        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual override {
        address owner = ERC721CustomUpgradeable.ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId);

        // Clear approvals
        _approve(address(0), tokenId);

        console.log("burning pupper");
        console.log(tokenId);

        _balances[owner] -= 1;
        puppersRemaining += 1;

        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }

    //
    // randYish
    //
    // Description:
    // Kind-of-random number generator. Seed based on blockchain conditions:
    // - difficulty
    // - miner's address
    // - gas limit
    // - sender's address
    // - block number
    // - `puppersRemaining`
    //
    // Notes:
    // - https://stackoverflow.com/questions/58188832/solidity-generate-unpredictable-random-number-that-does-not-depend-on-input
    //
    function randYish() public view returns (uint256 ret) {
        // todo: do we need any assertions here?

        uint256 seed = uint256(keccak256(abi.encodePacked(
                block.timestamp + block.difficulty +
                ((uint256(keccak256(abi.encodePacked(block.coinbase)))) / (block.timestamp)) +
                block.gaslimit +
                ((uint256(keccak256(abi.encodePacked(msg.sender)))) / (block.timestamp)) +
                block.number +
                puppersRemaining
            )));
        ret = (seed - ((seed / 1000) * 1000));
    }


    //
    // randYishInRange
    //
    // Description:
    // randYish in 0...maxRand range
    //
    function randYishInRange(uint256 maxRand) public view returns (uint256 ret) {
        // todo: do we need any assertions here?
        ret = randYish() % maxRand;
        //        console.log("randyishinrange");
        //        console.log(ret);
    }

    //
    // mintPuppers
    //
    // Description:
    // `mintPupper` but for minting multiple puppers with one ETH transaction
    //
    function mintPuppers(address to, uint256 qty) public {
        for (uint256 i = 0; i < qty; ++i) {
            mintPupper();
        }
    }

    //
    // mintPupper
    //
    // Description:
    // GET SOME PIXELS!
    // Specify amount of pixels you wish to receive. Your ETH address must entrust our contract of handling your
    // $DOG balance beforehand. You can open your $DOG balance for us with calling `approve` on the $DOG token contract.
    //
    function mintPupper() public returns (uint256 pupper){
        // todo: asserts
        // todo: near 0-len(mappings) indices handling
        require(puppersRemaining > 0, "No puppers remaining");
        uint256 index = INDEX_OFFSET + randYishInRange(puppersRemaining);
        // if indexToPupper[index] == null, initialize it with `index` pupper
        // this on-the-go initialization is optimization so gas fees for `indexToPupper` array initialization is delegated to the minter
        if (indexToPupper[index] == MAGIC_NULL) {
            indexToPupper[index] = index;
        }
        uint256 LAST_INDEX = INDEX_OFFSET + puppersRemaining - 1;
        if (indexToPupper[LAST_INDEX] == MAGIC_NULL) {
            indexToPupper[LAST_INDEX] = LAST_INDEX;
        }
        // return pupper @ `index`
        pupper = indexToPupper[index];
        // move pupper from `LAST_INDEX` to just used pupper
        indexToPupper[index] = indexToPupper[LAST_INDEX];
        // move used pupper to `unavailable` pool
        indexToPupper[LAST_INDEX] = pupper;
        pupperToIndex[pupper] = LAST_INDEX;
        _mint(msg.sender, pupper);
        // transfer collateral to contract's address
        DOG20.transferFrom(msg.sender, address(this), DOG_TO_PIXEL_SATOSHIS);
    }

    //
    // burnPupper
    //
    // Description:
    // Trade your pixel for $DOG token. Price is the original `DOG_TO_PIXEL_SATOSHIS` paid for original minting of
    // the pixel.
    //
    function burnPupper(uint256 pupper) public {
        // todo: asserts
        require(pupper != MAGIC_NULL, "Pupper is magic");
        require(ERC721CustomUpgradeable.ownerOf(pupper) == msg.sender, "Pupper is not yours");

        // swap burnt pupper with one at N+1 index
        uint256 oldIndex = pupperToIndex[pupper];
        uint256 LAST_INDEX = INDEX_OFFSET + puppersRemaining;
        uint256 tmpPupper = indexToPupper[LAST_INDEX];
        pupperToIndex[pupper] = LAST_INDEX;
        pupperToIndex[tmpPupper] = oldIndex;
        indexToPupper[oldIndex] = tmpPupper;
        indexToPupper[LAST_INDEX] = pupper;

        _burn(pupper);
        // transfer collateral to the burner
        DOG20.transfer(msg.sender, DOG_TO_PIXEL_SATOSHIS);
    }

    //
    // fuelPuppyDispenser
    //
    // Description:
    // Enable owner to transfer $DOG to contract's pool, without receiving any pixels
    //
    function fuelPuppyDispenser(uint256 amount) onlyOwner public {
        // todo: asserts
        // transfer some DOGs free of charge to DOGPUPPER contract
        DOG20.transferFrom(msg.sender, address(this), DOG_TO_PIXEL_SATOSHIS);
    }

    //
    // pupperToPixel
    //
    // Description:
    // Returns pixel index on .png from tokenId
    //
    function pupperToPixel(uint256 pupper) view public returns (uint256){
        return pupper - INDEX_OFFSET;
    }
    //
    // pupperToPixelCoords
    //
    // Description:
    // Returns pixel x,y on .png from tokenId
    //
    function pupperToPixelCoords(uint256 pupper) view public returns (uint256[2] memory) {
        uint256 index = pupper - INDEX_OFFSET;
        return [index % 512, index / 512];
    }
}
