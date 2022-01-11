const {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Metadata,
} = require('./ERC721.behavior');

const DOG20Mock = artifacts.require('DOG20');
const ERC721Mock = artifacts.require('PXMock');

contract('PX', function (accounts) {
  const name = 'Non Fungible Token';
  const symbol = 'NFT';

  beforeEach(async function () {
    const mock =  await DOG20Mock.new();
    this.token = await ERC721Mock.new(name, symbol, mock.address);
  });

  shouldBehaveLikeERC721('PX', ...accounts);
  shouldBehaveLikeERC721Metadata('PX', name, symbol, ...accounts);
});
