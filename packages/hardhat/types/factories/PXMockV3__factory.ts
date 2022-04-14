/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PXMockV3, PXMockV3Interface } from "../PXMockV3";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "BASE_URI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOG20",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOG_TO_PIXEL_SATOSHIS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INDEX_OFFSET",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAGIC_NULL",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SHIBA_HEIGHT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SHIBA_WIDTH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "V3",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "address",
        name: "DOG20Address",
        type: "address",
      },
      {
        internalType: "string",
        name: "ipfsUri_",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "width_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "height_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "DOG20_FEES_ADDRESS_DEV_",
        type: "address",
      },
      {
        internalType: "address",
        name: "DOG20_FEES_ADDRESS_PLEASR_",
        type: "address",
      },
    ],
    name: "__PXMock_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "address",
        name: "DOG20Address",
        type: "address",
      },
      {
        internalType: "string",
        name: "ipfsUri_",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "width_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "height_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "DOG20_FEES_ADDRESS_DEV_",
        type: "address",
      },
      {
        internalType: "address",
        name: "DOG20_FEES_ADDRESS_PLEASR_",
        type: "address",
      },
    ],
    name: "__PX_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "puppers",
        type: "uint256[]",
      },
    ],
    name: "burnPuppers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "qty",
        type: "uint256",
      },
    ],
    name: "mintPuppers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "pupper",
        type: "uint256",
      },
    ],
    name: "pupperToPixel",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "pupper",
        type: "uint256",
      },
    ],
    name: "pupperToPixelCoords",
    outputs: [
      {
        internalType: "uint256[2]",
        name: "",
        type: "uint256[2]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "puppersRemaining",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "randYish",
    outputs: [
      {
        internalType: "uint256",
        name: "ret",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "setDOG_TO_PIXEL_SATOSHIS",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "width",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "height",
        type: "uint256",
      },
    ],
    name: "setSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50600054610100900460ff168061002a575060005460ff16155b6100915760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff161580156100b3576000805461ffff19166101011790555b80156100c5576000805461ff00191690555b5061265780620000d66000396000f3fe608060405234801561001057600080fd5b50600436106101f05760003560e01c806395d89b411161010f578063b807f857116100a2578063dbddb26a11610071578063dbddb26a1461040b578063e4e4dc4214610413578063e985e9c514610426578063fc784d4914610462576101f0565b8063b807f857146103ca578063b88d4fde146103dd578063bcb00f29146103f0578063c87b56dd146103f8576101f0565b8063a6053eb5116100de578063a6053eb514610388578063a739d6441461039b578063b43ff0f0146103ae578063b78a7d72146103b7576101f0565b806395d89b411461035b57806397b874f714610363578063a035386d1461036c578063a22cb46514610375576101f0565b806323b872dd116101875780636352211e116101565780636352211e1461030c578063690c9f431461031f57806370a082311461032857806379d90b171461033b576101f0565b806323b872dd146102b85780632fb42d70146102cb57806342842e0e146102f05780635d29904e14610303576101f0565b8063095ea7b3116101c3578063095ea7b314610274578063109429901461028957806318160ddd1461029c578063199f90a6146102a5576101f0565b806301ffc9a7146101f5578063055fa0d51461021d57806306fdde0314610234578063081812fc14610249575b600080fd5b61020861020336600461217e565b610475565b60405190151581526020015b60405180910390f35b61022660985481565b604051908152602001610214565b61023c6104c9565b60405161021491906123e0565b61025c610257366004612280565b61055b565b6040516001600160a01b039091168152602001610214565b610287610282366004612091565b6105f5565b005b6102876102973660046120ba565b61070b565b61022660995481565b6102876102b33660046121b6565b6107b3565b6102876102c6366004611fa7565b6108f1565b60408051808201909152600981526848656c6c6f2056332160b81b602082015261023c565b6102876102fe366004611fa7565b610922565b61022660a05481565b61025c61031a366004612280565b61093d565b610226609f5481565b610226610336366004611f5b565b6109b4565b61034e610349366004612280565b610a3b565b60405161021491906123af565b61023c610a8a565b610226609e5481565b610226609c5481565b61028761038336600461205b565b610a99565b610287610396366004612280565b610aa8565b6102876103a93660046121b6565b610ccd565b610226609d5481565b60975461025c906001600160a01b031681565b6102876103d8366004612280565b609c55565b6102876103eb366004611fe2565b610d50565b610226610d88565b61023c610406366004612280565b610e93565b61023c610fa3565b610226610421366004612280565b611031565b610208610434366004611f75565b6001600160a01b039182166000908152606a6020908152604080832093909416825291909152205460ff1690565b610287610470366004612298565b611041565b60006001600160e01b031982166380ac58cd60e01b14806104a657506001600160e01b03198216635b5e139f60e01b145b806104c157506301ffc9a760e01b6001600160e01b03198316145b90505b919050565b6060606580546104d890612551565b80601f016020809104026020016040519081016040528092919081815260200182805461050490612551565b80156105515780601f1061052657610100808354040283529160200191610551565b820191906000526020600020905b81548152906001019060200180831161053457829003601f168201915b5050505050905090565b6000818152606760205260408120546001600160a01b03166105d95760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152606960205260409020546001600160a01b031690565b60006106008261093d565b9050806001600160a01b0316836001600160a01b0316141561066e5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084016105d0565b336001600160a01b038216148061068a575061068a8133610434565b6106fc5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c000000000000000060648201526084016105d0565b6107068383611061565b505050565b600081511161074c5760405162461bcd60e51b815260206004820152600d60248201526c456d707479207075707065727360981b60448201526064016105d0565b60005b81518110156107985761078882828151811061077b57634e487b7160e01b600052603260045260246000fd5b60200260200101516110cf565b6107918161258c565b905061074f565b506107b0609c5482516107ab91906124ef565b6111ed565b50565b600054610100900460ff16806107cc575060005460ff16155b6107e85760405162461bcd60e51b81526004016105d0906123f3565b600054610100900460ff1615801561080a576000805461ffff19166101011790555b6108148989611403565b6001600160a01b03871661082757600080fd5b609780546001600160a01b0319166001600160a01b038916179055690bb28f98c1e0715ce000609c55620f4240609d556000609e55609f85905560a084905561087084866124ef565b60995560a054609f5461088391906124ef565b60985585516108999060a1906020890190611e0f565b5060a280546001600160a01b038086166001600160a01b03199283161790925560a3805492851692909116919091179055602860a455603c60a55580156108e6576000805461ff00191690555b505050505050505050565b6108fb338261148a565b6109175760405162461bcd60e51b81526004016105d090612441565b61070683838361157d565b61070683838360405180602001604052806000815250610d50565b6000818152606760205260408120546001600160a01b0316806104c15760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b60648201526084016105d0565b60006001600160a01b038216610a1f5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b60648201526084016105d0565b506001600160a01b031660009081526068602052604090205490565b610a43611e93565b6000609d5483610a53919061250e565b90506040518060400160405280609f5483610a6e91906125a7565b8152602001609f5483610a8191906124db565b90529392505050565b6060606680546104d890612551565b610aa433838361171d565b5050565b60008111610af05760405162461bcd60e51b81526020600482015260156024820152744e6f6e20706f736974697665207175616e7469747960581b60448201526064016105d0565b609854811115610b395760405162461bcd60e51b81526020600482015260146024820152734e6f20707570706572732072656d61696e696e6760601b60448201526064016105d0565b60005b81811015610c24576000610b516098546117ec565b609d54610b5e91906124c3565b609e546000828152609a60205260409020549192501415610b8b576000818152609a602052604090208190555b60006001609854609d54610b9f91906124c3565b610ba9919061250e565b609e546000828152609a60205260409020549192501415610bd6576000818152609a602052604090208190555b6000828152609a602090815260408083208054858552828520805490925590819055808452609b909252909120829055610c103382611801565b50505080610c1d9061258c565b9050610b3c565b506097546001600160a01b03166323b872dd3330609c5485610c4691906124ef565b6040516001600160e01b031960e086901b1681526001600160a01b0393841660048201529290911660248301526044820152606401602060405180830381600087803b158015610c9557600080fd5b505af1158015610ca9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610aa49190612162565b600054610100900460ff1680610ce6575060005460ff16155b610d025760405162461bcd60e51b81526004016105d0906123f3565b600054610100900460ff16158015610d24576000805461ffff19166101011790555b610d3489898989898989896107b3565b80156108e6576000805461ff0019169055505050505050505050565b610d5a338361148a565b610d765760405162461bcd60e51b81526004016105d090612441565b610d8284848484611827565b50505050565b6000806098544342610d973390565b604051602001610dbf919060609190911b6bffffffffffffffffffffffff1916815260140190565b6040516020818303038152906040528051906020012060001c610de291906124db565b6040516bffffffffffffffffffffffff194160601b166020820152459042906034016040516020818303038152906040528051906020012060001c610e2791906124db565b610e3144426124c3565b610e3b91906124c3565b610e4591906124c3565b610e4f91906124c3565b610e5991906124c3565b610e6391906124c3565b604051602001610e7591815260200190565b60408051601f19818403018152919052805160209091012092915050565b6000818152606760205260409020546060906001600160a01b0316610f125760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b60648201526084016105d0565b6000610f1c6118a5565b90506000611388609d5485610f31919061250e565b610f3b91906124db565b610f469060016124c3565b90506000825111610f665760405180602001604052806000815250610f9b565b81610f70826118b4565b610f79866118b4565b604051602001610f8b939291906122e5565b6040516020818303038152906040525b949350505050565b60a18054610fb090612551565b80601f0160208091040260200160405190810160405280929190818152602001828054610fdc90612551565b80156110295780601f10610ffe57610100808354040283529160200191611029565b820191906000526020600020905b81548152906001019060200180831161100c57829003601f168201915b505050505081565b6000609d54826104c1919061250e565b600061104d82846124ef565b609881905560995550609f9190915560a055565b600081815260696020526040902080546001600160a01b0319166001600160a01b03841690811790915581906110968261093d565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b609e548114156111135760405162461bcd60e51b815260206004820152600f60248201526e507570706572206973206d6167696360881b60448201526064016105d0565b3361111d8261093d565b6001600160a01b0316146111695760405162461bcd60e51b8152602060048201526013602482015272507570706572206973206e6f7420796f75727360681b60448201526064016105d0565b6000818152609b6020526040812054609854609d5491929161118b91906124c3565b6000818152609a602081815260408084208054898652609b8452828620879055808652828620899055888652939092528320829055838352869055609880549394509092600192906111de9084906124c3565b90915550610d829050846119cf565b600060648060a4548461120091906124ef565b61120a91906124db565b61121491906124db565b9050600060648060a5548561122991906124ef565b61123391906124db565b61123d91906124db565b905060008161124c848661250e565b611256919061250e565b60975460a25460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101879052929350169063a9059cbb90604401602060405180830381600087803b1580156112a857600080fd5b505af11580156112bc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112e09190612162565b5060975460a35460405163a9059cbb60e01b81526001600160a01b0391821660048201526024810185905291169063a9059cbb90604401602060405180830381600087803b15801561133157600080fd5b505af1158015611345573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113699190612162565b506097546001600160a01b031663a9059cbb336040516001600160e01b031960e084901b1681526001600160a01b03909116600482015260248101849052604401602060405180830381600087803b1580156113c457600080fd5b505af11580156113d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113fc9190612162565b5050505050565b600054610100900460ff168061141c575060005460ff16155b6114385760405162461bcd60e51b81526004016105d0906123f3565b600054610100900460ff1615801561145a576000805461ffff19166101011790555b611462611a6a565b61146a611a6a565b6114748383611ad5565b8015610706576000805461ff0019169055505050565b6000818152606760205260408120546001600160a01b03166115035760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084016105d0565b600061150e8361093d565b9050806001600160a01b0316846001600160a01b031614806115495750836001600160a01b031661153e8461055b565b6001600160a01b0316145b80610f9b57506001600160a01b038082166000908152606a602090815260408083209388168352929052205460ff16610f9b565b826001600160a01b03166115908261093d565b6001600160a01b0316146115f85760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b60648201526084016105d0565b6001600160a01b03821661165a5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016105d0565b611665600082611061565b6001600160a01b038316600090815260686020526040812080546001929061168e90849061250e565b90915550506001600160a01b03821660009081526068602052604081208054600192906116bc9084906124c3565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b816001600160a01b0316836001600160a01b0316141561177f5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016105d0565b6001600160a01b038381166000818152606a6020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6000816117f7610d88565b6104c191906125a7565b61180b8282611b6a565b60016098600082825461181e919061250e565b90915550505050565b61183284848461157d565b61183e84848484611cac565b610d825760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b60648201526084016105d0565b606060a180546104d890612551565b6060816118d957506040805180820190915260018152600360fc1b60208201526104c4565b8160005b811561190357806118ed8161258c565b91506118fc9050600a836124db565b91506118dd565b60008167ffffffffffffffff81111561192c57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611956576020820181803683370190505b5090505b8415610f9b5761196b60018361250e565b9150611978600a866125a7565b6119839060306124c3565b60f81b8183815181106119a657634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506119c8600a866124db565b945061195a565b60006119da8261093d565b90506119e7600083611061565b6001600160a01b0381166000908152606860205260408120805460019290611a1090849061250e565b909155505060008281526067602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b600054610100900460ff1680611a83575060005460ff16155b611a9f5760405162461bcd60e51b81526004016105d0906123f3565b600054610100900460ff16158015611ac1576000805461ffff19166101011790555b80156107b0576000805461ff001916905550565b600054610100900460ff1680611aee575060005460ff16155b611b0a5760405162461bcd60e51b81526004016105d0906123f3565b600054610100900460ff16158015611b2c576000805461ffff19166101011790555b8251611b3f906065906020860190611e0f565b508151611b53906066906020850190611e0f565b508015610706576000805461ff0019169055505050565b6001600160a01b038216611bc05760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016105d0565b6000818152606760205260409020546001600160a01b031615611c255760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016105d0565b6001600160a01b0382166000908152606860205260408120805460019290611c4e9084906124c3565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60006001600160a01b0384163b15611e0457604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290611cf0903390899088908890600401612372565b602060405180830381600087803b158015611d0a57600080fd5b505af1925050508015611d3a575060408051601f3d908101601f19168201909252611d379181019061219a565b60015b611dea573d808015611d68576040519150601f19603f3d011682016040523d82523d6000602084013e611d6d565b606091505b508051611de25760405162461bcd60e51b815260206004820152603860248201527f455243373231437573746f6d3a207472616e7366657220746f206e6f6e20455260448201527f43373231526563656976657220696d706c656d656e746572000000000000000060648201526084016105d0565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610f9b565b506001949350505050565b828054611e1b90612551565b90600052602060002090601f016020900481019282611e3d5760008555611e83565b82601f10611e5657805160ff1916838001178555611e83565b82800160010185558215611e83579182015b82811115611e83578251825591602001919060010190611e68565b50611e8f929150611eb1565b5090565b60405180604001604052806002906020820280368337509192915050565b5b80821115611e8f5760008155600101611eb2565b600067ffffffffffffffff831115611ee057611ee06125e7565b611ef3601f8401601f1916602001612492565b9050828152838383011115611f0757600080fd5b828260208301376000602084830101529392505050565b80356001600160a01b03811681146104c457600080fd5b600082601f830112611f45578081fd5b611f5483833560208501611ec6565b9392505050565b600060208284031215611f6c578081fd5b611f5482611f1e565b60008060408385031215611f87578081fd5b611f9083611f1e565b9150611f9e60208401611f1e565b90509250929050565b600080600060608486031215611fbb578081fd5b611fc484611f1e565b9250611fd260208501611f1e565b9150604084013590509250925092565b60008060008060808587031215611ff7578081fd5b61200085611f1e565b935061200e60208601611f1e565b925060408501359150606085013567ffffffffffffffff811115612030578182fd5b8501601f81018713612040578182fd5b61204f87823560208401611ec6565b91505092959194509250565b6000806040838503121561206d578182fd5b61207683611f1e565b91506020830135612086816125fd565b809150509250929050565b600080604083850312156120a3578182fd5b6120ac83611f1e565b946020939093013593505050565b600060208083850312156120cc578182fd5b823567ffffffffffffffff808211156120e3578384fd5b818501915085601f8301126120f6578384fd5b813581811115612108576121086125e7565b8060051b9150612119848301612492565b8181528481019084860184860187018a1015612133578788fd5b8795505b83861015612155578035835260019590950194918601918601612137565b5098975050505050505050565b600060208284031215612173578081fd5b8151611f54816125fd565b60006020828403121561218f578081fd5b8135611f548161260b565b6000602082840312156121ab578081fd5b8151611f548161260b565b600080600080600080600080610100898b0312156121d2578384fd5b883567ffffffffffffffff808211156121e9578586fd5b6121f58c838d01611f35565b995060208b013591508082111561220a578586fd5b6122168c838d01611f35565b985061222460408c01611f1e565b975060608b0135915080821115612239578586fd5b506122468b828c01611f35565b9550506080890135935060a0890135925061226360c08a01611f1e565b915061227160e08a01611f1e565b90509295985092959890939650565b600060208284031215612291578081fd5b5035919050565b600080604083850312156122aa578182fd5b50508035926020909101359150565b600081518084526122d1816020860160208601612525565b601f01601f19169290920160200192915050565b600084516122f7818460208901612525565b6a0dacae8c2c8c2e8c25ae6d60ab1b908301908152845161231f81600b840160208901612525565b602f60f81b600b9290910191820152686d657461646174612d60b81b600c8201528351612353816015840160208801612525565b64173539b7b760d91b60159290910191820152601a0195945050505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906123a5908301846122b9565b9695505050505050565b60408101818360005b60028110156123d75781518352602092830192909101906001016123b8565b50505092915050565b600060208252611f5460208301846122b9565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b604051601f8201601f1916810167ffffffffffffffff811182821017156124bb576124bb6125e7565b604052919050565b600082198211156124d6576124d66125bb565b500190565b6000826124ea576124ea6125d1565b500490565b6000816000190483118215151615612509576125096125bb565b500290565b600082821015612520576125206125bb565b500390565b60005b83811015612540578181015183820152602001612528565b83811115610d825750506000910152565b600181811c9082168061256557607f821691505b6020821081141561258657634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156125a0576125a06125bb565b5060010190565b6000826125b6576125b66125d1565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b80151581146107b057600080fd5b6001600160e01b0319811681146107b057600080fdfea26469706673582212208fc3b39c4b16dc642cc7221b37edd3560392392f159299a42e65a58e1caaef8d64736f6c63430008030033";

type PXMockV3ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PXMockV3ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PXMockV3__factory extends ContractFactory {
  constructor(...args: PXMockV3ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PXMockV3> {
    return super.deploy(overrides || {}) as Promise<PXMockV3>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PXMockV3 {
    return super.attach(address) as PXMockV3;
  }
  connect(signer: Signer): PXMockV3__factory {
    return super.connect(signer) as PXMockV3__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PXMockV3Interface {
    return new utils.Interface(_abi) as PXMockV3Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PXMockV3 {
    return new Contract(address, _abi, signerOrProvider) as PXMockV3;
  }
}
