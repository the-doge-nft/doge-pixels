const {ethers, upgrades} = require("hardhat");
const {use, expect} = require("chai");
const {shuffle, range, randFromArray} = require("./utils");
const {solidity} = require("ethereum-waffle");
const {
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const ERROR_NO_PX_REMAINING = "No puppers remaining"
const ERROR_D20_TX_EXCEEDS_BALANCE = "ERC20: transfer amount exceeds balance"

use(solidity);
describe("[PX]", function () {
  const MOCK_WIDTH = 680;//512 * 384;
  const MOCK_HEIGHT = 10;//480
  const MOCK_SUPPLY = MOCK_WIDTH * MOCK_HEIGHT;
  const MOCK_URI = "ipfs://dog-repo/";
  const DOG_TO_PIXEL_SATOSHIS = 5;

  const INDEX_OFFSET = 1000000;

  let PX, DOG20;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let signers;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    done();
    // setTimeout(done, 2000);
  });
  // beforeEach(())
  before("Should deploy contract", async function () {
    signers = await ethers.getSigners();
    [owner, addr1, addr2, addr3] = signers

    let factory;

    factory = await ethers.getContractFactory("DOG20");
    DOG20 = await upgrades.deployProxy(factory);
    await DOG20.deployed();
    await DOG20.__DOG20_init(signers.map(item => item.address), DOG_TO_PIXEL_SATOSHIS * MOCK_SUPPLY);

    factory = await ethers.getContractFactory("PXMock");
    PX = await upgrades.deployProxy(factory);
    await PX.deployed();
    await PX.__PXMock_init("LONG LIVE D O G", "PX", DOG20.address, MOCK_URI, MOCK_WIDTH, MOCK_HEIGHT);

    await Promise.all([
                        PX.setDOG_TO_PIXEL_SATOSHIS(DOG_TO_PIXEL_SATOSHIS)
                      ]);
  });

  async function mintPupperWithValidation(signer, _shouldRevertWithMessage = undefined) {
    // console.log("minting for " + signer.address);
    const addrDog20BalanceBefore = await DOG20.balanceOf(signer.address);
    const pxDog20BalanceBefore = await DOG20.balanceOf(PX.address);
    const addrPXBalanceBefore = await PX.balanceOf(signer.address);
    const supplyPXBalanceBefore = await PX.puppersRemaining();
    await DOG20.connect(signer).approve(PX.address, DOG_TO_PIXEL_SATOSHIS);
    let tx;
    if (_shouldRevertWithMessage) {
      tx = await expectRevert(PX.connect(signer).mintPupper(), _shouldRevertWithMessage);
      return;
    } else {
      tx = await PX.connect(signer).mintPupper()
    }
    expect(await DOG20.balanceOf(PX.address)).to.equal(pxDog20BalanceBefore.toNumber() + DOG_TO_PIXEL_SATOSHIS)
    expect(await DOG20.balanceOf(signer.address)).to.equal(addrDog20BalanceBefore.toNumber() - DOG_TO_PIXEL_SATOSHIS)

    expect(await PX.balanceOf(signer.address)).to.equal(addrPXBalanceBefore.toNumber() + 1)
    expect(await PX.puppersRemaining()).to.equal(supplyPXBalanceBefore.toNumber() - 1);


    let receipt = await tx.wait();
    let tokenId;
    for (let i = 0; i < receipt.events.length; ++i) {
      const event = receipt.events[i];
      if (event.event === 'Transfer') {
        tokenId = event.args.tokenId;
        console.log(`minted ${tokenId.toNumber()} for ${signer.address}`);
        break;
      }
    }
    if(tokenId) {
      const index = tokenId.toNumber() - INDEX_OFFSET;
      const x = index % MOCK_WIDTH;
      const y = Math.floor(index / MOCK_WIDTH);
      expect(await PX.tokenURI(tokenId)).to.equal(`${MOCK_URI}${x}_${y}`);
      return tokenId;
    }else {
      throw new Error("Transfer event was not fired");
    }
  }

  function getSignerFromAddress(addr) {
    for (let i = 0; i < signers.length; ++i) {
      if (signers[i].address === addr) {
        return signers[i];
      }
    }
  }

  async function burnPupperWithValidation(signer, pupper, _shouldRevertWithMessage = undefined) {
    // console.log("minting for " + addr.address);
    const addrDog20BalanceBefore = await DOG20.balanceOf(signer.address);
    const pxDog20BalanceBefore = await DOG20.balanceOf(PX.address);
    const addrPXBalanceBefore = await PX.balanceOf(signer.address);
    const supplyPXBalanceBefore = await PX.puppersRemaining();
    let tx;
    console.log(`trying to burn ${pupper} with addr ${signer.address}`)
    if (_shouldRevertWithMessage) {
      tx = await expectRevert(PX.connect(signer).burnPupper(pupper), _shouldRevertWithMessage);
      return;
    } else {
      tx = await PX.connect(signer).burnPupper(pupper)
    }

    expect(await DOG20.balanceOf(PX.address)).to.equal(pxDog20BalanceBefore.toNumber() - DOG_TO_PIXEL_SATOSHIS)
    expect(await DOG20.balanceOf(signer.address)).to.equal(addrDog20BalanceBefore.toNumber() + DOG_TO_PIXEL_SATOSHIS)

    expect(await PX.balanceOf(signer.address)).to.equal(addrPXBalanceBefore.toNumber() - 1)
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
      this.timeout(0);
      let count = 0;
      while (true) {
        await mintPupperWithValidation(addr1);
        ++count;
        const remaining = await PX.puppersRemaining();
        if (remaining.toNumber() === 0) {
          break;
        }
        if (count % 1000 == 0) {
          const p = (count / MOCK_SUPPLY * 100).toFixed(2);
          console.log(`progress ${p}%`);
        }
      }
      console.log("=== END ===")
      console.log(`minted ${count} tokens`)
      await expectRevert(mintPupperWithValidation(addr1), ERROR_NO_PX_REMAINING);
    });
    it('burn all supply', async function () {
      const arr = shuffle(range(MOCK_SUPPLY));
      // burn in random order
      for (let i = 0; i < arr.length; ++i) {
        const tokenId = arr[i] + INDEX_OFFSET;
        const o = await PX.ownerOf(tokenId);
        const signer = getSignerFromAddress(o);
        console.log(`owner of ${tokenId} is ${signer.address}`)
        await burnPupperWithValidation(signer, tokenId);
        await burnPupperWithValidation(signer, tokenId, 'ERC721: owner query for nonexistent token');
      }
    });
    it('mint/burn cycle', async function () {
      const cyclesQty = MOCK_SUPPLY * 20;
      let divider = 2;
      for (let i = 0; i < cyclesQty; ++i) {
        const remaining = (await PX.puppersRemaining()).toNumber();
        if (i % 10 === 0) {
          // mingle divider every 10 steps
          divider = (Math.floor(Math.random() * 10000) % 7) + 2;
          console.log(`divider is now ${divider}`)
        }
        if (Math.floor(Math.random() * 100000) % divider) {
          if (remaining === 0) {
            await mintPupperWithValidation(randFromArray(signers), ERROR_NO_PX_REMAINING);
          }
        } else {
          const signer = randFromArray(signers);
          const tokenId = randFromArray(range(MOCK_SUPPLY)) + INDEX_OFFSET;
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
    it('address can only mint up to their $DOG balance', async function () {
      const [owner, , , , signer4] = await ethers.getSigners()
      // clear D20 balance
      const balance = (await DOG20.balanceOf(signer4.address)).toNumber()
      if (balance !== 0) {
        await DOG20.connect(signer4).transfer(owner.address, balance)
      }

      // credit 2PX worth of D20
      const amountOfPXtoMint = 2
      await DOG20.initMock([signer4.address], DOG_TO_PIXEL_SATOSHIS * amountOfPXtoMint);
      for (let i = 0; i < amountOfPXtoMint; i++) {
        await mintPupperWithValidation(signer4);
      }
      await mintPupperWithValidation(signer4, ERROR_D20_TX_EXCEEDS_BALANCE);
    })
    it('sender is a contract', function () {

    });
    it('try to mint with sender having no $DOG balance', async function () {
      signers = await ethers.getSigners()
      const [owner, , , , signer4] = signers
      const balance = (await DOG20.balanceOf(signer4.address)).toNumber()
      if (balance !== 0) {
        await DOG20.connect(signer4).transfer(owner.address, balance)
      }
      await mintPupperWithValidation(signer4, ERROR_D20_TX_EXCEEDS_BALANCE)
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
