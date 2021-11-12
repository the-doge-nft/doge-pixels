// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "../ERC20/ERC20.sol";
import "../ERC721/ERC721.sol";
import "../../access/Ownable.sol";
import "hardhat/console.sol";

contract PX is ERC721, Ownable {
    // Fractional.art ERC20 contract holding $DOG tokens
    IERC20 private immutable DOG20;

    // TODO: are we actually good with sticking with pseudo random generator?
    // TODO: could we be actually good with sticking no-random, consecutive numbes in `indexToPupper` == 1....N numbers in order
    // TODO: HOW much optimizations do we actually need?
    uint256 public puppersRemaining;
//    uint256 public immutable totalSupply;
    uint256 public totalSupply;

    mapping(uint256 => uint256) indexToPupper;
    mapping(uint256 => address) pupperToOwner;
    mapping(uint256 => uint256) pupperToIndex;

    // production version:
    // uint256 immutable DOG_TO_PIXEL_SATOSHIS = 5523989899;
    uint256 public DOG_TO_PIXEL_SATOSHIS = 5523989899;

    constructor(string memory name_, string memory symbol_, address DOG20Address) ERC721(name_, symbol_){
        require(DOG20Address != address(0));
        DOG20 = IERC20(DOG20Address);
//        _setBaseURI("https://ipfs.io/ipfs/");
        totalSupply = 521*384; // 200064
        puppersRemaining = 521*384;
//        for(uint256 i = 0; i < totalSupply; ++i){
//            indexToPupper[i] = i;
//        }
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
    function randYish() public view returns(uint256 ret) {
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
//        console.log("seed: ");
//        console.log(seed);
//        console.log(ret);
    }


    //
    // randYishInRange
    //
    // Description:
    // randYish in 0...maxRand range
    //
    function randYishInRange(uint256 maxRand) public view returns(uint256 ret) {
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
    function mintPuppers(address to, uint256 qty) public onlyOwner {
        for(uint256 i = 0; i < qty; ++i){
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
        uint256 index = randYishInRange(puppersRemaining);
        // swap minted pupper with one from available pool
        // == move minted pupper to the edge. move pupper from the edge to the minted index
        pupper = indexToPupper[index];
        indexToPupper[index] = indexToPupper[puppersRemaining - 1];
        indexToPupper[puppersRemaining - 1] = pupper;
        pupperToIndex[pupper] = puppersRemaining - 1;
        pupperToOwner[pupper] = msg.sender;
        puppersRemaining -= 1;
        pupperToOwner[pupper] = msg.sender;

        //        console.log("new pupper");
        //        console.log(pupper);
        _mint(msg.sender, pupper);

        console.log(DOG20.balanceOf(msg.sender))

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
        // todo: near 0-len(mappings) indices handling

        // swap burnt pupper with one at N+1 index
        uint256 oldIndex = pupperToIndex[pupper];
        uint256 tmpPupper = indexToPupper[puppersRemaining];
        pupperToIndex[pupper] = puppersRemaining;
        pupperToIndex[tmpPupper] = oldIndex;
        indexToPupper[oldIndex] = tmpPupper;
        indexToPupper[puppersRemaining] = pupper;
        puppersRemaining += 1;
        pupperToOwner[pupper] = address(0)  ;

        console.log("burning pupper");
        console.log(pupper);
        _burn(pupper);
        // transfer collateral to the burner
        DOG20.transfer( msg.sender, DOG_TO_PIXEL_SATOSHIS);
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

}
