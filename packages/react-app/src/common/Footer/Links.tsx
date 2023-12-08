export const socialLinks = [
  { title: "Twitter", link: "https://twitter.com/ownthedoge" },
  { title: "Discord", link: "https://discord.com/invite/thedogenft" },
  { title: "Telegram", link: "https://t.me/ownthedoge" },
  { title: "Reddit", link: "https://www.reddit.com/r/ownthedoge/" },
  { title: "Youtube", link: "https://www.youtube.com/channel/UCSKWuhABdkFJ4UpjvlnOrNg" },
  { title: "Instagram", link: "https://www.instagram.com/ownthedoge/" },
  { title: "TikTok", link: "https://www.tiktok.com/@ownthedoge" },
  { title: "Coingecko", link: "https://www.coingecko.com/en/coins/the-doge-nft" },
];

export const readLinks = [
  { title: "Own The Doge", link: "https://ownthedoge.com" },
  { title: "Whitepaper", link: "https://pleasr.mirror.xyz/7hpdJOWRzQx2pmCA16MDxN2FiA3eY6dwcrnEtXKnCJw" },
  {
    title: "What?",
    link: "https://medium.com/the-doge-times/the-doge-nft-become-a-part-of-the-memeverse-with-dog-3d43169e3647",
  },
  { title: "Blog", link: "https://medium.com/the-doge-times" },
  { title: "Etherscan", link: "https://etherscan.io/address/0x07887Ee0Bd24E774903963d50cF4Ec6a0a16977D" },
  { title: "Meet The Doge", link: "https://meethedoge.com" },
  { title: "Much Wow Film", link: "https://muchwowfilm.com" },
];

export const actionLinks = [
  { title: "Pixels", link: "https://pixels.thedao.ge/" },
  { title: "Fractional", link: "https://fractional.art/vaults/the-doge-nft" },
];

export const tradeLinks = [
  { title: "$DOG", link: "https://swap.defillama.com/?chain=ethereum&from=0x0000000000000000000000000000000000000000&to=0xbaac2b4491727d78d2b78815144570b9f2fe8899" },
];

export const chains = [
  {
    chain: "Ethereum Mainnet",
    contractAddress: "0xBAac2B4491727D78D2b78815144570b9f2Fe8899",
    link: "https://etherscan.io/token/0xbaac2b4491727d78d2b78815144570b9f2fe8899?a=0x020ca66c30bec2c4fe3861a94e4db4a498a35872",
    trade: [
      {
        name: "CowSwap",
        url: "https://cowswap.exchange/#/swap?outputCurrency=0xBAac2B4491727D78D2b78815144570b9f2Fe8899&inputCurrency=ETH&chain=mainnet",
      },
      {
        name: "Matcha",
        url: "https://matcha.xyz/markets/1/0xbaac2b4491727d78d2b78815144570b9f2fe8899/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
      {
        name: "SushiSwap",
        url: "https://app.sushi.com/swap?outputCurrency=0xbaac2b4491727d78d2b78815144570b9f2fe8899",
      },
      {
        name: "Uniswap",
        url: "https://app.uniswap.org/#/swap?chain=mainnet&outputCurrency=0xBAac2B4491727D78D2b78815144570b9f2Fe8899&inputCurrency=ETH",
      },
    ],
  },
  {
    chain: "Polygon",
    contractAddress: "0xeEe3371B89FC43Ea970E908536Fcddd975135D8a",
    link: "https://polygonscan.com/token/0xeEe3371B89FC43Ea970E908536Fcddd975135D8a",
    trade: [
      {
        name: "QuickSwap",
        url: "https://quickswap.exchange/#/swap?outputCurrency=0xeee3371b89fc43ea970e908536fcddd975135d8a&inputCurrency=0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      },
    ],
    bridge: [
      {
        name: "Synapse Protocol",
        url: "https://synapseprotocol.com/?inputCurrency=DOG&outputCurrency=DOG&outputChain=137",
      },
    ],
  },
  {
    chain: "Arbitrum One",
    contractAddress: "0x4425742F1EC8D98779690b5A3A6276Db85Ddc01A",
    link: "https://arbiscan.io/token/0x4425742f1ec8d98779690b5a3a6276db85ddc01a#balances",
    trade: [
      {
        name: "Sushiswap",
        url: "https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x4425742F1EC8D98779690b5A3A6276Db85Ddc01A&chain=arbitrum",
      },
    ],
    bridge: [{ name: "Arbitrum Bridge", url: "https://bridge.arbitrum.io/" }],
  },
  {
    chain: "Binance Smart Chain",
    contractAddress: "0xaa88c603d142c371ea0eac8756123c5805edee03",
    link: "https://bscscan.com/token/0xaa88c603d142c371ea0eac8756123c5805edee03",
    trade: [
      {
        name: "PancakeSwap",
        url: "https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=0xaa88c603d142c371ea0eac8756123c5805edee03",
      },
    ],
    bridge: [
      {
        name: "Synapse Protocol",
        url: "https://synapseprotocol.com/?inputCurrency=DOG&outputCurrency=DOG&outputChain=56",
      },
    ],
  },
  {
    chain: "Optimism",
    link: "https://optimistic.etherscan.io/token/0x8F69Ee043d52161Fd29137AeDf63f5e70cd504D5",
    contractAddress: "0x8F69Ee043d52161Fd29137AeDf63f5e70cd504D5",
    bridge: [{ name: "Optimism Bridge", url: "https://gateway.optimism.io/" }],
  },
];
