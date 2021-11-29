/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PXMock, PXMockInterface } from "../PXMock";

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
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
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
        name: "DOG20_FEES_ADDRESS_",
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
        name: "DOG20_FEES_ADDRESS_",
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
    inputs: [],
    name: "baseURI",
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
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "burnPupper",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "exists",
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
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintPupper",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "renounceOwnership",
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
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeMint",
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
    name: "safeMint",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506129b5806100206000396000f3fe608060405234801561001057600080fd5b50600436106102535760003560e01c8063715018a611610146578063b43ff0f0116100c3578063d85d95ef11610087578063d85d95ef146104c9578063dbddb26a146104d1578063e4e4dc42146104d9578063e985e9c5146104ec578063f2fde38b14610528578063fc784d491461053b57600080fd5b8063b43ff0f01461047f578063b807f85714610488578063b88d4fde1461049b578063bcb00f29146104ae578063c87b56dd146104b657600080fd5b806397b874f71161010a57806397b874f714610434578063a035386d1461043d578063a144819414610446578063a22cb46514610459578063a6053eb51461046c57600080fd5b8063715018a6146103e057806379d90b17146103e85780638832e6e3146104085780638da5cb5b1461041b57806395d89b411461042c57600080fd5b806342842e0e116101d4578063690c9f4311610198578063690c9f43146103965780636c0360eb1461039f5780636d677a74146103a757806370a08231146103ba5780637132e47b146103cd57600080fd5b806342842e0e1461034157806342966c68146103545780634f558e79146103675780635d29904e1461037a5780636352211e1461038357600080fd5b8063109429901161021b57806310942990146102ec57806318160ddd146102ff57806323b872dd14610308578063369df6e71461031b57806340c10f191461032e57600080fd5b806301ffc9a714610258578063055fa0d51461028057806306fdde0314610297578063081812fc146102ac578063095ea7b3146102d7575b600080fd5b61026b610266366004612494565b61054e565b60405190151581526020015b60405180910390f35b61028960ca5481565b604051908152602001610277565b61029f6105a0565b60405161027791906126ec565b6102bf6102ba366004612585565b610632565b6040516001600160a01b039091168152602001610277565b6102ea6102e5366004612352565b6106cc565b005b6102ea6102fa3660046123d0565b6107e2565b61028960cb5481565b6102ea61031636600461227b565b61088a565b6102ea6103293660046124cc565b6108bb565b6102ea61033c366004612352565b61093d565b6102ea61034f36600461227b565b61094b565b6102ea610362366004612585565b610966565b61026b610375366004612585565b61096f565b61028960d25481565b6102bf610391366004612585565b61098e565b61028960d15481565b61029f610a05565b6102ea6103b5366004612585565b610a14565b6102896103c8366004612228565b610a2f565b6102ea6103db3660046124cc565b610ab6565b6102ea610bd8565b6103fb6103f6366004612585565b610c3e565b60405161027791906126bb565b6102ea61041636600461237b565b610c8d565b6097546001600160a01b03166102bf565b61029f610c98565b61028960d05481565b61028960ce5481565b6102ea610454366004612352565b610ca7565b6102ea61046736600461231c565b610cb1565b6102ea61047a366004612585565b610cbc565b61028960cf5481565b6102ea610496366004612585565b60ce55565b6102ea6104a93660046122b6565b610f2f565b610289610f67565b61029f6104c4366004612585565b611065565b6102ea611162565b61029f61116c565b6102896104e7366004612585565b6111fa565b61026b6104fa366004612249565b6001600160a01b039182166000908152606a6020908152604080832093909416825291909152205460ff1690565b6102ea610536366004612228565b61120a565b6102ea61054936600461259d565b6112d2565b60006001600160e01b031982166380ac58cd60e01b148061057f57506001600160e01b03198216635b5e139f60e01b145b8061059a57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060606580546105af906128af565b80601f01602080910402602001604051908101604052809291908181526020018280546105db906128af565b80156106285780601f106105fd57610100808354040283529160200191610628565b820191906000526020600020905b81548152906001019060200180831161060b57829003601f168201915b5050505050905090565b6000818152606760205260408120546001600160a01b03166106b05760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152606960205260409020546001600160a01b031690565b60006106d78261098e565b9050806001600160a01b0316836001600160a01b031614156107455760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084016106a7565b336001600160a01b0382161480610761575061076181336104fa565b6107d35760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c000000000000000060648201526084016106a7565b6107dd83836112f2565b505050565b60008151116108235760405162461bcd60e51b815260206004820152600d60248201526c456d707479207075707065727360981b60448201526064016106a7565b60005b815181101561086f5761085f82828151811061085257634e487b7160e01b600052603260045260246000fd5b6020026020010151611360565b610868816128ea565b9050610826565b5061088760ce548251610882919061284d565b611548565b50565b6108943382611681565b6108b05760405162461bcd60e51b81526004016106a79061279f565b6107dd838383611774565b600054610100900460ff16806108d4575060005460ff16155b6108f05760405162461bcd60e51b81526004016106a790612751565b600054610100900460ff16158015610912576000805461ffff19166101011790555b61092188888888888888610ab6565b8015610933576000805461ff00191690555b5050505050505050565b6109478282611914565b5050565b6107dd83838360405180602001604052806000815250610f2f565b61088781611360565b6000818152606760205260408120546001600160a01b0316151561059a565b6000818152606760205260408120546001600160a01b03168061059a5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b60648201526084016106a7565b6060610a0f611a78565b905090565b610a1d81611360565b61088760ce546001610882919061284d565b60006001600160a01b038216610a9a5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b60648201526084016106a7565b506001600160a01b031660009081526068602052604090205490565b600054610100900460ff1680610acf575060005460ff16155b610aeb5760405162461bcd60e51b81526004016106a790612751565b600054610100900460ff16158015610b0d576000805461ffff19166101011790555b610b178888611a87565b6001600160a01b038616610b2a57600080fd5b60c980546001600160a01b0319166001600160a01b038816179055690bb28f98c1e0715ce00060ce55620f424060cf55600060d05560d184905560d2839055610b73838561284d565b60cb5560d25460d154610b86919061284d565b60ca558451610b9c9060d39060208801906120ea565b5060d480546001600160a01b0319166001600160a01b038416179055601460d5558015610933576000805461ff00191690555050505050505050565b6097546001600160a01b03163314610c325760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016106a7565b610c3c6000611b0e565b565b610c4661216e565b600060cf5483610c56919061286c565b9050604051806040016040528060d15483610c719190612905565b815260200160d15483610c849190612839565b90529392505050565b6107dd838383611b60565b6060606680546105af906128af565b6109478282611b93565b610947338383611bad565b60008111610d045760405162461bcd60e51b81526020600482015260156024820152744e6f6e20706f736974697665207175616e7469747960581b60448201526064016106a7565b60ca54811115610d4d5760405162461bcd60e51b81526020600482015260146024820152734e6f20707570706572732072656d61696e696e6760601b60448201526064016106a7565b60005b81811015610e8157600060ca5411610da15760405162461bcd60e51b81526020600482015260146024820152734e6f20707570706572732072656d61696e696e6760601b60448201526064016106a7565b6000610dae60ca54611c7c565b60cf54610dbb9190612821565b60d054600082815260cc60205260409020549192501415610de857600081815260cc602052604090208190555b6000600160ca5460cf54610dfc9190612821565b610e06919061286c565b60d054600082815260cc60205260409020549192501415610e3357600081815260cc602052604090208190555b600082815260cc60209081526040808320805485855282852080549092559081905580845260cd909252909120829055610e6d3382611914565b50505080610e7a906128ea565b9050610d50565b5060c95460ce546001600160a01b03909116906323b872dd9033903090610ea8908661284d565b6040516001600160e01b031960e086901b1681526001600160a01b0393841660048201529290911660248301526044820152606401602060405180830381600087803b158015610ef757600080fd5b505af1158015610f0b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109479190612478565b610f393383611681565b610f555760405162461bcd60e51b81526004016106a79061279f565b610f6184848484611c91565b50505050565b60ca546040516bffffffffffffffffffffffff193360601b1660208201526000918291439042906034016040516020818303038152906040528051906020012060001c610fb49190612839565b6040516bffffffffffffffffffffffff194160601b166020820152459042906034016040516020818303038152906040528051906020012060001c610ff99190612839565b6110034442612821565b61100d9190612821565b6110179190612821565b6110219190612821565b61102b9190612821565b6110359190612821565b60405160200161104791815260200190565b60408051601f19818403018152919052805160209091012092915050565b6000818152606760205260409020546060906001600160a01b03166110e45760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b60648201526084016106a7565b60006110ee611a78565b905060006110fb84610c3e565b9050600082511161111b576040518060200160405280600081525061115a565b8161112d8260005b6020020151611cc4565b611138836001611123565b60405160200161114a939291906125ea565b6040516020818303038152906040525b949350505050565b610c3c6001610cbc565b60d38054611179906128af565b80601f01602080910402602001604051908101604052809291908181526020018280546111a5906128af565b80156111f25780601f106111c7576101008083540402835291602001916111f2565b820191906000526020600020905b8154815290600101906020018083116111d557829003601f168201915b505050505081565b600060cf548261059a919061286c565b6097546001600160a01b031633146112645760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016106a7565b6001600160a01b0381166112c95760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016106a7565b61088781611b0e565b60006112de828461284d565b60ca81905560cb555060d19190915560d255565b600081815260696020526040902080546001600160a01b0319166001600160a01b03841690811790915581906113278261098e565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60d0548114156113a45760405162461bcd60e51b815260206004820152600f60248201526e507570706572206973206d6167696360881b60448201526064016106a7565b336113ae8261098e565b6001600160a01b0316146113fa5760405162461bcd60e51b8152602060048201526013602482015272507570706572206973206e6f7420796f75727360681b60448201526064016106a7565b600081815260cd602052604081205460ca5460cf5491929161141c9190612821565b600081815260cc60208181526040808420805489865260cd84528286208790558086528286208990558886529390925283208290558383528690559192506114638561098e565b90506114706000866112f2565b61149f6040518060400160405280600e81526020016d313ab93734b73390383ab83832b960911b815250611dde565b6114a885611e21565b6001600160a01b03811660009081526068602052604081208054600192906114d190849061286c565b92505081905550600160ca60008282546114eb9190612821565b909155505060008581526067602052604080822080546001600160a01b0319169055518691906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050505050565b6000606460d5548361155a919061284d565b6115649190612839565b90506000611572828461286c565b60c95460d45460405163a9059cbb60e01b81526001600160a01b03918216600482015260248101869052929350169063a9059cbb90604401602060405180830381600087803b1580156115c457600080fd5b505af11580156115d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115fc9190612478565b5060c95460405163a9059cbb60e01b8152336004820152602481018390526001600160a01b039091169063a9059cbb90604401602060405180830381600087803b15801561164957600080fd5b505af115801561165d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f619190612478565b6000818152606760205260408120546001600160a01b03166116fa5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084016106a7565b60006117058361098e565b9050806001600160a01b0316846001600160a01b031614806117405750836001600160a01b031661173584610632565b6001600160a01b0316145b8061115a57506001600160a01b038082166000908152606a602090815260408083209388168352929052205460ff1661115a565b826001600160a01b03166117878261098e565b6001600160a01b0316146117ef5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b60648201526084016106a7565b6001600160a01b0382166118515760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016106a7565b61185c6000826112f2565b6001600160a01b038316600090815260686020526040812080546001929061188590849061286c565b90915550506001600160a01b03821660009081526068602052604081208054600192906118b3908490612821565b909155505060008181526067602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6001600160a01b03821661196a5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016106a7565b6000818152606760205260409020546001600160a01b0316156119cf5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016106a7565b6001600160a01b03821660009081526068602052604081208054600192906119f8908490612821565b9091555050600081815260676020526040812080546001600160a01b0319166001600160a01b03851617905560ca805460019290611a3790849061286c565b909155505060405181906001600160a01b038416906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b606060d380546105af906128af565b600054610100900460ff1680611aa0575060005460ff16155b611abc5760405162461bcd60e51b81526004016106a790612751565b600054610100900460ff16158015611ade576000805461ffff19166101011790555b611ae6611e66565b611aee611e66565b611af88383611ed1565b80156107dd576000805461ff0019169055505050565b609780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b611b6a8383611914565b611b776000848484611f66565b6107dd5760405162461bcd60e51b81526004016106a7906126ff565b610947828260405180602001604052806000815250611b60565b816001600160a01b0316836001600160a01b03161415611c0f5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016106a7565b6001600160a01b038381166000818152606a6020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b600081611c87610f67565b61059a9190612905565b611c9c848484611774565b611ca884848484611f66565b610f615760405162461bcd60e51b81526004016106a7906126ff565b606081611ce85750506040805180820190915260018152600360fc1b602082015290565b8160005b8115611d125780611cfc816128ea565b9150611d0b9050600a83612839565b9150611cec565b60008167ffffffffffffffff811115611d3b57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611d65576020820181803683370190505b5090505b841561115a57611d7a60018361286c565b9150611d87600a86612905565b611d92906030612821565b60f81b818381518110611db557634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350611dd7600a86612839565b9450611d69565b61088781604051602401611df291906126ec565b60408051601f198184030181529190526020810180516001600160e01b031663104c13eb60e21b1790526120c9565b61088781604051602401611e3791815260200190565b60408051601f198184030181529190526020810180516001600160e01b031663f5b1bba960e01b1790526120c9565b600054610100900460ff1680611e7f575060005460ff16155b611e9b5760405162461bcd60e51b81526004016106a790612751565b600054610100900460ff16158015611ebd576000805461ffff19166101011790555b8015610887576000805461ff001916905550565b600054610100900460ff1680611eea575060005460ff16155b611f065760405162461bcd60e51b81526004016106a790612751565b600054610100900460ff16158015611f28576000805461ffff19166101011790555b8251611f3b9060659060208601906120ea565b508151611f4f9060669060208501906120ea565b5080156107dd576000805461ff0019169055505050565b60006001600160a01b0384163b156120be57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290611faa90339089908890889060040161267e565b602060405180830381600087803b158015611fc457600080fd5b505af1925050508015611ff4575060408051601f3d908101601f19168201909252611ff1918101906124b0565b60015b6120a4573d808015612022576040519150601f19603f3d011682016040523d82523d6000602084013e612027565b606091505b50805161209c5760405162461bcd60e51b815260206004820152603860248201527f455243373231437573746f6d3a207472616e7366657220746f206e6f6e20455260448201527f43373231526563656976657220696d706c656d656e746572000000000000000060648201526084016106a7565b805181602001fd5b6001600160e01b031916630a85bd0160e11b14905061115a565b506001949350505050565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b8280546120f6906128af565b90600052602060002090601f016020900481019282612118576000855561215e565b82601f1061213157805160ff191683800117855561215e565b8280016001018555821561215e579182015b8281111561215e578251825591602001919060010190612143565b5061216a92915061218c565b5090565b60405180604001604052806002906020820280368337509192915050565b5b8082111561216a576000815560010161218d565b80356001600160a01b03811681146121b857600080fd5b919050565b600082601f8301126121cd578081fd5b813567ffffffffffffffff8111156121e7576121e7612945565b6121fa601f8201601f19166020016127f0565b81815284602083860101111561220e578283fd5b816020850160208301379081016020019190915292915050565b600060208284031215612239578081fd5b612242826121a1565b9392505050565b6000806040838503121561225b578081fd5b612264836121a1565b9150612272602084016121a1565b90509250929050565b60008060006060848603121561228f578081fd5b612298846121a1565b92506122a6602085016121a1565b9150604084013590509250925092565b600080600080608085870312156122cb578081fd5b6122d4856121a1565b93506122e2602086016121a1565b925060408501359150606085013567ffffffffffffffff811115612304578182fd5b612310878288016121bd565b91505092959194509250565b6000806040838503121561232e578182fd5b612337836121a1565b915060208301356123478161295b565b809150509250929050565b60008060408385031215612364578182fd5b61236d836121a1565b946020939093013593505050565b60008060006060848603121561238f578283fd5b612398846121a1565b925060208401359150604084013567ffffffffffffffff8111156123ba578182fd5b6123c6868287016121bd565b9150509250925092565b600060208083850312156123e2578182fd5b823567ffffffffffffffff808211156123f9578384fd5b818501915085601f83011261240c578384fd5b81358181111561241e5761241e612945565b8060051b915061242f8483016127f0565b8181528481019084860184860187018a1015612449578788fd5b8795505b8386101561246b57803583526001959095019491860191860161244d565b5098975050505050505050565b600060208284031215612489578081fd5b81516122428161295b565b6000602082840312156124a5578081fd5b813561224281612969565b6000602082840312156124c1578081fd5b815161224281612969565b600080600080600080600060e0888a0312156124e6578485fd5b873567ffffffffffffffff808211156124fd578687fd5b6125098b838c016121bd565b985060208a013591508082111561251e578687fd5b61252a8b838c016121bd565b975061253860408b016121a1565b965060608a013591508082111561254d578485fd5b5061255a8a828b016121bd565b9450506080880135925060a0880135915061257760c089016121a1565b905092959891949750929550565b600060208284031215612596578081fd5b5035919050565b600080604083850312156125af578182fd5b50508035926020909101359150565b600081518084526125d6816020860160208601612883565b601f01601f19169290920160200192915050565b600084516125fc818460208901612883565b676d6574616461746160c01b908301908152602f60f81b6008820152686d657461646174612d60b81b6009820152845161263d816012840160208901612883565b605f60f81b60129290910191820152835161265f816013840160208801612883565b64173539b7b760d91b6013929091019182015260180195945050505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906126b1908301846125be565b9695505050505050565b60408101818360005b60028110156126e35781518352602092830192909101906001016126c4565b50505092915050565b60208152600061224260208301846125be565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b604051601f8201601f1916810167ffffffffffffffff8111828210171561281957612819612945565b604052919050565b6000821982111561283457612834612919565b500190565b6000826128485761284861292f565b500490565b600081600019048311821515161561286757612867612919565b500290565b60008282101561287e5761287e612919565b500390565b60005b8381101561289e578181015183820152602001612886565b83811115610f615750506000910152565b600181811c908216806128c357607f821691505b602082108114156128e457634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156128fe576128fe612919565b5060010190565b6000826129145761291461292f565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461088757600080fd5b6001600160e01b03198116811461088757600080fdfea2646970667358221220d3c1995529101f02bfcf14ea0e98ff45bfb7172b389da6d53f76f83921b7422864736f6c63430008040033";

type PXMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PXMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PXMock__factory extends ContractFactory {
  constructor(...args: PXMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PXMock> {
    return super.deploy(overrides || {}) as Promise<PXMock>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PXMock {
    return super.attach(address) as PXMock;
  }
  connect(signer: Signer): PXMock__factory {
    return super.connect(signer) as PXMock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PXMockInterface {
    return new utils.Interface(_abi) as PXMockInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): PXMock {
    return new Contract(address, _abi, signerOrProvider) as PXMock;
  }
}
