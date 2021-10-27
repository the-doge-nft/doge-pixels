/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const INFURA_URL = "https://rinkeby.infura.io/v3/d7c84abc4db841b3af75091fdcb92814"
const PRIVATE_KEY = "7e31b47e6c89a441000f31f11a011d11c0e4219370fb2e07cbb0094348177866"

require('@nomiclabs/hardhat-waffle')
module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: INFURA_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
