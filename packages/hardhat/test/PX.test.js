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
const runTests = (withUpgrade) => {
  const suiteName = withUpgrade ? "PX:V2" : "PX:V1";
  describe(suiteName, function () {
    const CROP = 0.02;
    const MOCK_WIDTH = Math.floor(680 * CROP);//512 * 384;
    const MOCK_HEIGHT = Math.floor(480 * CROP);
    const MOCK_SUPPLY = MOCK_WIDTH * MOCK_HEIGHT;
    const MOCK_URI = "ipfs://dog-repo/";
    const DOG_TO_PIXEL_SATOSHIS = ethers.BigNumber.from('5523989899').mul(10 ** 13);
    const BURN_FEES_PERCENT_DEV = 40;
    const BURN_FEES_PERCENT_PLEASR = 60;
    let FEES_ACCOUNT_DEV,
        FEES_ACCOUNT_PLEASR;

    const INDEX_OFFSET = 1000000;
    const SHARD_SIZE = 5000;

    let PX, DOG20;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let signers;

    const mintLog = [];

    function getShardIndex(indexWithOffset) {
      // shards count start from 1
      const shard = 1 + Math.floor((indexWithOffset - INDEX_OFFSET) / SHARD_SIZE);
      return shard;
    }
    // quick fix to let gas reporter fetch data from gas station & coinmarketcap
    before((done) => {
      done();
      // setTimeout(done, 2000);
    });
    // beforeEach(())
    before("Should deploy contract", async function () {
      signers = await ethers.getSigners();
      [owner, addr1, addr2, addr3] = signers

      FEES_ACCOUNT_DEV = signers[10]
      FEES_ACCOUNT_PLEASR = signers[11]

      let factory;

      factory = await ethers.getContractFactory("DOG20");
      DOG20 = await upgrades.deployProxy(factory);
      await DOG20.deployed();
      await DOG20.__DOG20_init(signers.map(item => item.address), DOG_TO_PIXEL_SATOSHIS.mul(MOCK_SUPPLY));

      factory = await ethers.getContractFactory("PXMock");
      PX = await upgrades.deployProxy(factory);
      await PX.deployed();
      await PX.__PXMock_init(
        "LONG LIVE D O G",
        "PX",
        DOG20.address,
        MOCK_URI,
        MOCK_WIDTH,
        MOCK_HEIGHT,
        FEES_ACCOUNT_DEV.address,
        FEES_ACCOUNT_PLEASR.address,
      );

      await Promise.all([
                          PX.setDOG_TO_PIXEL_SATOSHIS(DOG_TO_PIXEL_SATOSHIS)
                        ]);
      expect(await PX.SHIBA_WIDTH()).to.be.equal(MOCK_WIDTH)
      expect(await PX.SHIBA_HEIGHT()).to.be.equal(MOCK_HEIGHT)

      // Test upgrading the contract
      if (withUpgrade) {
        const PXV2 = await ethers.getContractFactory('PXMock_V2');
        console.log('Upgrading PX...');
        await upgrades.upgradeProxy(PX.address, PXV2);
        PX = await PXV2.attach(PX.address);
        console.log('PX upgraded');
      }
    });

    async function mintPupperWithValidation(signer, mintQty = 1, _shouldRevertWithMessage = undefined) {
      // console.log("minting for " + signer.address);
      const addrDog20BalanceBefore = await DOG20.balanceOf(signer.address);
      const pxDog20BalanceBefore = await DOG20.balanceOf(PX.address);
      const addrPXBalanceBefore = await PX.balanceOf(signer.address);
      const supplyPXBalanceBefore = await PX.puppersRemaining();
      await DOG20.connect(signer).approve(PX.address, DOG_TO_PIXEL_SATOSHIS.mul(mintQty));
      let tx;
      const foo = () => {
        return PX.connect(signer).mintPuppers(mintQty);
      }
      if (_shouldRevertWithMessage) {
        tx = await expectRevert(foo(), _shouldRevertWithMessage);
        return;
      } else {
        tx = await foo()
      }
      expect(await DOG20.balanceOf(PX.address)).to.equal(pxDog20BalanceBefore.add(DOG_TO_PIXEL_SATOSHIS.mul(mintQty)))
      expect(await DOG20.balanceOf(signer.address)).to.equal(addrDog20BalanceBefore.sub(DOG_TO_PIXEL_SATOSHIS.mul(mintQty)))
      expect(await PX.balanceOf(signer.address)).to.equal(addrPXBalanceBefore.add(mintQty))
      expect(await PX.puppersRemaining()).to.equal(supplyPXBalanceBefore.sub(mintQty));


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
      if (tokenId) {
        const idWithOffset = tokenId.toNumber();
        expect(await PX.tokenURI(tokenId)).to.equal(`${MOCK_URI}metadata-sh${getShardIndex(idWithOffset)}/metadata-${idWithOffset}.json`);
        return tokenId;
      } else {
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
      const feesDevDog20BalanceBefore = await DOG20.balanceOf(FEES_ACCOUNT_DEV.address);
      const feesPleasrDog20BalanceBefore = await DOG20.balanceOf(FEES_ACCOUNT_PLEASR.address);
      const addrPXBalanceBefore = await PX.balanceOf(signer.address);
      const supplyPXBalanceBefore = await PX.puppersRemaining();
      let tx;
      console.log(`trying to burn ${pupper} with addr ${signer.address}`)
      if (_shouldRevertWithMessage) {
        tx = await expectRevert(PX.connect(signer).burnPuppers([pupper]), _shouldRevertWithMessage);
        return;
      } else {
        tx = await PX.connect(signer).burnPuppers([pupper])
      }

      expect(await DOG20.balanceOf(PX.address)).to.equal(pxDog20BalanceBefore.sub(DOG_TO_PIXEL_SATOSHIS))
      expect(await DOG20.balanceOf(signer.address)).to.equal(addrDog20BalanceBefore.add(DOG_TO_PIXEL_SATOSHIS.mul(99).div(100)))
      expect(await DOG20.balanceOf(FEES_ACCOUNT_DEV.address)).to.equal(feesDevDog20BalanceBefore.add(DOG_TO_PIXEL_SATOSHIS.mul(BURN_FEES_PERCENT_DEV).div(100).div(100)))
      expect(await DOG20.balanceOf(FEES_ACCOUNT_PLEASR.address)).to.equal(feesPleasrDog20BalanceBefore.add(DOG_TO_PIXEL_SATOSHIS.mul(BURN_FEES_PERCENT_PLEASR).div(100).div(100)));

      expect(await PX.balanceOf(signer.address)).to.equal(addrPXBalanceBefore.sub(1))
      expect(await PX.puppersRemaining()).to.equal(supplyPXBalanceBefore.add(1));
      //
      // let receipt = await tx.wait();
      // for (let i = 0; i < receipt.events.length; ++i) {
      //   const event = receipt.events[i];§
      //   if (event.event === 'Transfer') {
      //     const tokenId = event.args.tokenId;
      //     console.log(`minted ${tokenId.toNumber()} for ${addr.address}`);
      //     return tokenId;
      //   }
      // }
      // throw new Error("Transfer event was not fired");
    }

    context('supply', function () {
      if (withUpgrade) {
        it('check if contract is upgraded', async function () {
          // if contract is not upgraded, v2Test() call will throw
          await PX.v2Test();
        });
      }
      it('sender should be an owner of new pixel after calling mint()', async function () {
        const tokenId = await mintPupperWithValidation(addr1);
        expect(await PX.ownerOf(tokenId)).to.equal(addr1.address);
      });
      it('mintPuppers(): can mint a puppy', async function () {
        await mintPupperWithValidation(addr1);
        await mintPupperWithValidation(addr2);
        await mintPupperWithValidation(addr3);
      });
      it('burnPuppers(): owner can burn a puppy', async function () {
        const burn = [];
        burn.push(await mintPupperWithValidation(addr1));
        burn.push(await mintPupperWithValidation(addr2));
        burn.push(await mintPupperWithValidation(addr3));
        await PX.connect(addr1).burnPuppers([burn[0]]);
        await PX.connect(addr2).burnPuppers([burn[1]]);
        await PX.connect(addr3).burnPuppers([burn[2]]);
      });
      it('pupper can be transferred from token owner to another address', async function () {
        const tokenId = await mintPupperWithValidation(addr1)
        expect(await PX.ownerOf(tokenId)).to.equal(addr1.address)

        await PX.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId)
        expect(await PX.ownerOf(tokenId)).to.equal(addr2.address)

        await PX.connect(addr2).transferFrom(addr2.address, addr1.address, tokenId)
        expect(await PX.ownerOf(tokenId)).to.equal(addr1.address)
      })
      // it('address can only mint up to their $DOG balance', async function () {
      //   const [owner, , , , signer4] = await ethers.getSigners()
      //   let balance = (await DOG20.balanceOf(signer4.address)).toNumber()
      //   expect(balance).to.be.greaterThanOrEqual(DOG_TO_PIXEL_SATOSHIS);
      //   while (balance >= DOG_TO_PIXEL_SATOSHIS) {
      //     await mintPupperWithValidation(signer4);
      //     balance = (await DOG20.balanceOf(signer4.address)).toNumber()
      //   }
      //   await mintPupperWithValidation(signer4, 1, ERROR_D20_TX_EXCEEDS_BALANCE);
      // })
      it('try to mint with sender having no $DOG balance', async function () {
        signers = await ethers.getSigners()
        // console.log(signers.length);
        // process.exit(0);
        const [owner, , , , signer4] = signers
        const balance = await DOG20.balanceOf(signer4.address);
        if (!balance.isZero()) {
          await DOG20.connect(signer4).transfer(owner.address, balance)
        }
        await mintPupperWithValidation(signer4, 1, ERROR_D20_TX_EXCEEDS_BALANCE)
      });
      it('burnPuppers empty array throws', async function () {
        await expectRevert(PX.connect(addr1).burnPuppers([]), "Empty puppers");
      });
      it('burnPuppers burns puppies', async function () {
        const burnburnburn = [];
        // must have 4 for the test
        expect((await PX.puppersRemaining()).toNumber()).to.be.greaterThanOrEqual(4);

        burnburnburn.push(await mintPupperWithValidation(addr1));
        burnburnburn.push(await mintPupperWithValidation(addr1));
        burnburnburn.push(await mintPupperWithValidation(addr1));
        burnburnburn.push(await mintPupperWithValidation(addr1));
        await PX.connect(addr1).burnPuppers(burnburnburn);
      });
      it('unsuccessful minting does not change any balances', function () {

      });
      it('unsuccessful burning does not change any balances', function () {

      });
      it('cannot mint if available supply == 0', function () {

      });
      it('cannot burn token you are not owner of', function () {

      });
      it('cannot burn token if sender is not ERC20Receiver compatible(prevention from locking out $DOG)', function () {

      });
      it('can mint token that has been previously burnt', function () {

      });

      it('mint all supply', async function () {
        this.timeout(0);
        let count = 0;
        while (true) {
          const remaining = await PX.puppersRemaining();
          console.log(`remaining: ${remaining}`)
          if (remaining.toNumber() === 0) {
            break;
          }
          await mintPupperWithValidation(addr1);
          ++count;
          if (count % 250 == 0) {
            const p = (count / MOCK_SUPPLY * 100).toFixed(2);
            console.log(`progress ${p}%`);
          }
        }
        console.log("=== END ===")
        console.log(`minted ${count} tokens`)
        await mintPupperWithValidation(addr1, 1, ERROR_NO_PX_REMAINING);
      });
      it('burn all supply', async function () {
        this.timeout(0);
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
        const cyclesQty = MOCK_SUPPLY * 1;
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
              await mintPupperWithValidation(randFromArray(signers.slice(0, 2)), ERROR_NO_PX_REMAINING);
            }
          } else {
            const signer = randFromArray(signers.slice(0, 2));
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
          if (i % Math.floor(cyclesQty / 50) === 0) {
            const p = (i / cyclesQty * 100).toFixed(2);
            console.log(`progress ${p}%`);
          }
        }
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
};
runTests(false);
runTests(true);
