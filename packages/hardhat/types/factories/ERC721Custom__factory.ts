/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ERC721Custom, ERC721CustomInterface } from "../ERC721Custom";

const _abi = [
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
    ],
    stateMutability: "nonpayable",
    type: "constructor",
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
  "0x60806040523480156200001157600080fd5b50604051620016b9380380620016b98339810160408190526200003491620001c1565b81516200004990600090602085019062000068565b5080516200005f90600190602084019062000068565b5050506200027b565b828054620000769062000228565b90600052602060002090601f0160209004810192826200009a5760008555620000e5565b82601f10620000b557805160ff1916838001178555620000e5565b82800160010185558215620000e5579182015b82811115620000e5578251825591602001919060010190620000c8565b50620000f3929150620000f7565b5090565b5b80821115620000f35760008155600101620000f8565b600082601f8301126200011f578081fd5b81516001600160401b03808211156200013c576200013c62000265565b604051601f8301601f19908116603f0116810190828211818310171562000167576200016762000265565b8160405283815260209250868385880101111562000183578485fd5b8491505b83821015620001a6578582018301518183018401529082019062000187565b83821115620001b757848385830101525b9695505050505050565b60008060408385031215620001d4578182fd5b82516001600160401b0380821115620001eb578384fd5b620001f9868387016200010e565b935060208501519150808211156200020f578283fd5b506200021e858286016200010e565b9150509250929050565b600181811c908216806200023d57607f821691505b602082108114156200025f57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b61142e806200028b6000396000f3fe608060405234801561001057600080fd5b50600436106100df5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb465146101c3578063b88d4fde146101d6578063c87b56dd146101e9578063e985e9c5146101fc576100df565b80636352211e1461018757806370a082311461019a57806395d89b41146101bb576100df565b8063095ea7b3116100bd578063095ea7b31461014c57806323b872dd1461016157806342842e0e14610174576100df565b806301ffc9a7146100e457806306fdde031461010c578063081812fc14610121575b600080fd5b6100f76100f23660046111ca565b610238565b60405190151581526020015b60405180910390f35b6101146102d7565b60405161010391906112b1565b61013461012f366004611202565b610369565b6040516001600160a01b039091168152602001610103565b61015f61015a3660046111a1565b610403565b005b61015f61016f366004611057565b610535565b61015f610182366004611057565b6105bc565b610134610195366004611202565b6105d7565b6101ad6101a836600461100b565b610662565b604051908152602001610103565b6101146106fc565b61015f6101d1366004611167565b61070b565b61015f6101e4366004611092565b61071a565b6101146101f7366004611202565b6107a8565b6100f761020a366004611025565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982167f80ac58cd00000000000000000000000000000000000000000000000000000000148061029b57506001600160e01b031982167f5b5e139f00000000000000000000000000000000000000000000000000000000145b806102cf57507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b03198316145b90505b919050565b6060600080546102e690611333565b80601f016020809104026020016040519081016040528092919081815260200182805461031290611333565b801561035f5780601f106103345761010080835404028352916020019161035f565b820191906000526020600020905b81548152906001019060200180831161034257829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b03166103e75760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b600061040e826105d7565b9050806001600160a01b0316836001600160a01b031614156104985760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f720000000000000000000000000000000000000000000000000000000000000060648201526084016103de565b336001600160a01b03821614806104b457506104b4813361020a565b6105265760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c000000000000000060648201526084016103de565b610530838361089e565b505050565b61053f3382610919565b6105b15760405162461bcd60e51b815260206004820152603160248201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f76656400000000000000000000000000000060648201526084016103de565b610530838383610a10565b6105308383836040518060200160405280600081525061071a565b6000818152600260205260408120546001600160a01b0316806102cf5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201527f656e7420746f6b656e000000000000000000000000000000000000000000000060648201526084016103de565b60006001600160a01b0382166106e05760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a6560448201527f726f20616464726573730000000000000000000000000000000000000000000060648201526084016103de565b506001600160a01b031660009081526003602052604090205490565b6060600180546102e690611333565b610716338383610bea565b5050565b6107243383610919565b6107965760405162461bcd60e51b815260206004820152603160248201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f76656400000000000000000000000000000060648201526084016103de565b6107a284848484610cb9565b50505050565b6000818152600260205260409020546060906001600160a01b03166108355760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201527f6e6578697374656e7420746f6b656e000000000000000000000000000000000060648201526084016103de565b600061084c60408051602081019091526000815290565b9050600081511161086c5760405180602001604052806000815250610897565b8061087684610d42565b604051602001610887929190611246565b6040516020818303038152906040525b9392505050565b6000818152600460205260409020805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b03841690811790915581906108e0826105d7565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600260205260408120546001600160a01b03166109925760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084016103de565b600061099d836105d7565b9050806001600160a01b0316846001600160a01b031614806109d85750836001600160a01b03166109cd84610369565b6001600160a01b0316145b80610a0857506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316610a23826105d7565b6001600160a01b031614610a9f5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201527f73206e6f74206f776e000000000000000000000000000000000000000000000060648201526084016103de565b6001600160a01b038216610b1a5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016103de565b610b2560008261089e565b6001600160a01b0383166000908152600360205260408120805460019290610b4e9084906112f0565b90915550506001600160a01b0382166000908152600360205260408120805460019290610b7c9084906112c4565b9091555050600081815260026020526040808220805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b816001600160a01b0316836001600160a01b03161415610c4c5760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016103de565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b610cc4848484610a10565b610cd084848484610e91565b6107a25760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016103de565b606081610d83575060408051808201909152600181527f300000000000000000000000000000000000000000000000000000000000000060208201526102d2565b8160005b8115610dad5780610d978161136e565b9150610da69050600a836112dc565b9150610d87565b60008167ffffffffffffffff811115610dd657634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015610e00576020820181803683370190505b5090505b8415610a0857610e156001836112f0565b9150610e22600a86611389565b610e2d9060306112c4565b60f81b818381518110610e5057634e487b7160e01b600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350610e8a600a866112dc565b9450610e04565b60006001600160a01b0384163b15610fe957604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610ed5903390899088908890600401611275565b602060405180830381600087803b158015610eef57600080fd5b505af1925050508015610f1f575060408051601f3d908101601f19168201909252610f1c918101906111e6565b60015b610fcf573d808015610f4d576040519150601f19603f3d011682016040523d82523d6000602084013e610f52565b606091505b508051610fc75760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e746572000000000000000000000000000060648201526084016103de565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610a08565b506001949350505050565b80356001600160a01b03811681146102d257600080fd5b60006020828403121561101c578081fd5b61089782610ff4565b60008060408385031215611037578081fd5b61104083610ff4565b915061104e60208401610ff4565b90509250929050565b60008060006060848603121561106b578081fd5b61107484610ff4565b925061108260208501610ff4565b9150604084013590509250925092565b600080600080608085870312156110a7578081fd5b6110b085610ff4565b93506110be60208601610ff4565b925060408501359150606085013567ffffffffffffffff808211156110e1578283fd5b818701915087601f8301126110f4578283fd5b813581811115611106576111066113c9565b604051601f8201601f19908116603f0116810190838211818310171561112e5761112e6113c9565b816040528281528a6020848701011115611146578586fd5b82602086016020830137918201602001949094529598949750929550505050565b60008060408385031215611179578182fd5b61118283610ff4565b915060208301358015158114611196578182fd5b809150509250929050565b600080604083850312156111b3578182fd5b6111bc83610ff4565b946020939093013593505050565b6000602082840312156111db578081fd5b8135610897816113df565b6000602082840312156111f7578081fd5b8151610897816113df565b600060208284031215611213578081fd5b5035919050565b60008151808452611232816020860160208601611307565b601f01601f19169290920160200192915050565b60008351611258818460208801611307565b83519083019061126c818360208801611307565b01949350505050565b60006001600160a01b038087168352808616602084015250836040830152608060608301526112a7608083018461121a565b9695505050505050565b600060208252610897602083018461121a565b600082198211156112d7576112d761139d565b500190565b6000826112eb576112eb6113b3565b500490565b6000828210156113025761130261139d565b500390565b60005b8381101561132257818101518382015260200161130a565b838111156107a25750506000910152565b600181811c9082168061134757607f821691505b6020821081141561136857634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156113825761138261139d565b5060010190565b600082611398576113986113b3565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b0319811681146113f557600080fd5b5056fea2646970667358221220bf8dd48097239e1ecf016f9c028847b70d3dfbeb297894d76b0decd6d714dbbc64736f6c63430008030033";

type ERC721CustomConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721CustomConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721Custom__factory extends ContractFactory {
  constructor(...args: ERC721CustomConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC721Custom> {
    return super.deploy(
      name_,
      symbol_,
      overrides || {}
    ) as Promise<ERC721Custom>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  attach(address: string): ERC721Custom {
    return super.attach(address) as ERC721Custom;
  }
  connect(signer: Signer): ERC721Custom__factory {
    return super.connect(signer) as ERC721Custom__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721CustomInterface {
    return new utils.Interface(_abi) as ERC721CustomInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC721Custom {
    return new Contract(address, _abi, signerOrProvider) as ERC721Custom;
  }
}
