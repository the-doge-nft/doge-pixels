const {ethers} = require("hardhat");
const {use, expect} = require("chai");
const {shuffle, range, randFromArray} = require("./utils");
const {solidity} = require("ethereum-waffle");
const {
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

use(solidity);
describe("[PX]", function () {
  const MOCK_SUPPLY = 10;
  const DOG_TO_PIXEL_SATOSHIS = 5;

  let PX, DOG20;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let signers;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    done();
    // setTimeout(done, 2000);
  });
  // beforeEach(())
  before("Should deploy contract", async function () {
    signers = await ethers.getSigners();
    [owner, addr1, addr2, addr3, addr4] = signers
    let factory;
    factory = await ethers.getContractFactory("DOG20");
    DOG20 = await factory.deploy();
    // console.log(signers)
    await DOG20.initMock(signers.map(item => item.address));

    factory = await ethers.getContractFactory("PXMock");

    PX = await factory.deploy("LONG LIVE D O G", "PX", DOG20.address);

    await Promise.all([
                        PX.setSupply(MOCK_SUPPLY),
                        PX.setDOG_TO_PIXEL_SATOSHIS(DOG_TO_PIXEL_SATOSHIS)
                      ]);

    // console.log(PX)
  });

  async function mintPupperWithValidation(addr, _expectToRevert = false) {
    // console.log("minting for " + addr.address);
    const addrDog20BalanceBefore = await DOG20.balanceOf(addr.address);
    const pxDog20BalanceBefore = await DOG20.balanceOf(PX.address);
    const addrPXBalanceBefore = await PX.balanceOf(addr.address);
    const supplyPXBalanceBefore = await PX.puppersRemaining();
    await DOG20.connect(addr).approve(PX.address, DOG_TO_PIXEL_SATOSHIS);
    let tx;
    if (_expectToRevert) {
      tx = await expectRevert(PX.connect(addr).mintPupper(), 'No puppers remaining');
      return;
    } else {
      tx = await PX.connect(addr).mintPupper()
    }
    expect(await DOG20.balanceOf(PX.address)).to.equal(pxDog20BalanceBefore.toNumber() + DOG_TO_PIXEL_SATOSHIS)
    expect(await DOG20.balanceOf(addr.address)).to.equal(addrDog20BalanceBefore.toNumber() - DOG_TO_PIXEL_SATOSHIS)

    expect(await PX.balanceOf(addr.address)).to.equal(addrPXBalanceBefore.toNumber() + 1)
    expect(await PX.puppersRemaining()).to.equal(supplyPXBalanceBefore.toNumber() - 1);


    let receipt = await tx.wait();
    for (let i = 0; i < receipt.events.length; ++i) {
      const event = receipt.events[i];
      if (event.event === 'Transfer') {
        const tokenId = event.args.tokenId;
        console.log(`minted ${tokenId.toNumber()} for ${addr.address}`);
        return tokenId;
      }
    }
    throw new Error("Transfer event was not fired");
  }

  function getSignerFromAddress(addr) {
    for (let i = 0; i < signers.length; ++i) {
      if (signers[i].address === addr) {
        return signers[i];
      }
    }
  }

  async function burnPupperWithValidation(addr, pupper, _shouldRevertWithMessage = undefined) {
    // console.log("minting for " + addr.address);
    const addrDog20BalanceBefore = await DOG20.balanceOf(addr.address);
    const pxDog20BalanceBefore = await DOG20.balanceOf(PX.address);
    const addrPXBalanceBefore = await PX.balanceOf(addr.address);
    const supplyPXBalanceBefore = await PX.puppersRemaining();
    let tx;
    console.log(`trying to burn ${pupper} with addr ${addr.address}`)
    if (_shouldRevertWithMessage) {
      tx = await expectRevert(PX.connect(addr).burnPupper(pupper), _shouldRevertWithMessage);
      return;
    } else {
      tx = await PX.connect(addr).burnPupper(pupper)
    }

    expect(await DOG20.balanceOf(PX.address)).to.equal(pxDog20BalanceBefore.toNumber() - DOG_TO_PIXEL_SATOSHIS)
    expect(await DOG20.balanceOf(addr.address)).to.equal(addrDog20BalanceBefore.toNumber() + DOG_TO_PIXEL_SATOSHIS)

    expect(await PX.balanceOf(addr.address)).to.equal(addrPXBalanceBefore.toNumber() - 1)
    expect(await PX.puppersRemaining()).to.equal(supplyPXBalanceBefore.toNumber() + 1);

    //
    // let receipt = await tx.wait();
    // for (let i = 0; i < receipt.events.length; ++i) {
    //   const event = receipt.events[i];
    //   if (event.event === 'Transfer') {
    //     const tokenId = event.args.tokenId;
    //     console.log(`minted ${tokenId.toNumber()} for ${addr.address}`);
    //     return tokenId;
    //   }
    // }
    // throw new Error("Transfer event was not fired");
  }

  context('supply', function () {
    it('sender should be an owner of new pixel after calling mint()', function () {

    });
    it('minting increases PX $DOG balance', async function () {
      await mintPupperWithValidation(addr1);
      await mintPupperWithValidation(addr2);
      await mintPupperWithValidation(addr3);
    });
    it('mint all supply', async function () {
      while (true) {
        await mintPupperWithValidation(addr1);
        const remaining = await PX.puppersRemaining();
        if (remaining.toNumber() === 0) {
          break;
        }
      }
      await expectRevert(mintPupperWithValidation(addr1), 'No puppers remaining');
    });
    it('burn all supply', async function () {
      const arr = shuffle(range(MOCK_SUPPLY));
      // burn in random order
      for (let i = 0; i < arr.length; ++i) {
        const tokenId = arr[i];
        const o = await PX.ownerOf(tokenId);
        const signer = getSignerFromAddress(o);
        console.log(`owner of ${tokenId} is ${signer.address}`)
        await burnPupperWithValidation(signer, tokenId);
        await expectRevert(burnPupperWithValidation(signer, tokenId), 'ERC721: owner query for nonexistent token');
      }
    });
    it('mint/burn cycle', async function () {
      const cyclesQty = MOCK_SUPPLY * 50;
      let divider = 2;
      for (let i = 0; i < cyclesQty; ++i) {
        const remaining = (await PX.puppersRemaining()).toNumber();
        if (i % 10 === 0) {
          // mingle divider every 10 steps
          divider = (Math.floor(Math.random() * 10000) % 7) + 2;
          console.log(`divider is now ${divider}`)
        }
        if (Math.floor(Math.random() * 100000) % divider) {
          await mintPupperWithValidation(randFromArray(signers), remaining === 0);
        } else {
          const signer = randFromArray(signers);
          const tokenId = randFromArray(range(MOCK_SUPPLY));
          let shouldRevert = true;
          let isOwnerOf;
          try {
            isOwnerOf = (await PX.ownerOf(tokenId)) === signer.address;
          } catch (e) {

          }
          if (isOwnerOf) {
            await burnPupperWithValidation(signer, tokenId);
          } else if (isOwnerOf === false) {
            await burnPupperWithValidation(signer, tokenId, 'Pupper is not yours');
          } else {
            await burnPupperWithValidation(signer, tokenId, 'ERC721: owner query for nonexistent token');
          }
        }
      }

    });

    //@TODO: minting multiple puppers rn does not work
    it('single address can mint multipler puppers', async function() {
      await mintPupperWithValidation(addr4);
      await mintPupperWithValidation(addr4);
    })

    it('sender is a contract', function () {

    });
    it('try to mint with sender having no $DOG balance', function () {

    });
    it('minting decreases available supply', function () {

    });
    it('unsuccessful minting does not change any balances', function () {

    });
    it('burning token decreases senders $DOG balance', function () {

    });
    it('burning token increases PX $DOG balance', function () {

    });
    it('burning token increases available supply', function () {

    });
    it('unsuccessful burning does not change any balances', function () {

    });
    it('it should throw if trying to mint token above the supply', function () {

    });
    it('can mint if available supply > 0', function () {

    });
    it('cannot mint if available supply == 0', function () {

    });
    it('cannot burn token you are not owner of', function () {

    });
    it('cannot burn token if sender is not ERC20Receiver compatible(prevention from locking out $DOG)', function () {

    });
    it('cannot mint token if sender is not ERC721Receiver', function () {

    });
    it('can mint token that has been previously burnt', function () {

    });


    it('=== run at the end === totalSupply should stay constant', function () {

    });
  });
  context('bruteforce', function () {
    describe('run all tests for different setups', function () {
      it('it runs test suite on clean slate', function () {

      });
      it('it runs test suite after 200x full mint/burnt cycles of all supply', function () {

      });
    })
  });

});
