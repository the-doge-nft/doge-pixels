/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BigNumberish,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ERC20PresetFixedSupply,
  ERC20PresetFixedSupplyInterface,
} from "../ERC20PresetFixedSupply";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
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
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
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
        name: "amount",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000f0438038062000f048339810160408190526200003491620002c3565b8351849084906200004d9060039060208501906200016a565b508051620000639060049060208401906200016a565b5050506200007881836200008260201b60201c565b50505050620003cc565b6001600160a01b038216620000dd5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b8060026000828254620000f1919062000354565b90915550506001600160a01b038216600090815260208190526040812080548392906200012090849062000354565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b828054620001789062000379565b90600052602060002090601f0160209004810192826200019c5760008555620001e7565b82601f10620001b757805160ff1916838001178555620001e7565b82800160010185558215620001e7579182015b82811115620001e7578251825591602001919060010190620001ca565b50620001f5929150620001f9565b5090565b5b80821115620001f55760008155600101620001fa565b600082601f83011262000221578081fd5b81516001600160401b03808211156200023e576200023e620003b6565b604051601f8301601f19908116603f01168101908282118183101715620002695762000269620003b6565b8160405283815260209250868385880101111562000285578485fd5b8491505b83821015620002a8578582018301518183018401529082019062000289565b83821115620002b957848385830101525b9695505050505050565b60008060008060808587031215620002d9578384fd5b84516001600160401b0380821115620002f0578586fd5b620002fe8883890162000210565b9550602087015191508082111562000314578485fd5b50620003238782880162000210565b60408701516060880151919550935090506001600160a01b038116811462000349578182fd5b939692955090935050565b600082198211156200037457634e487b7160e01b81526011600452602481fd5b500190565b600181811c908216806200038e57607f821691505b60208210811415620003b057634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b610b2880620003dc6000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c806342966c681161008c57806395d89b411161006657806395d89b4114610197578063a457c2d71461019f578063a9059cbb146101b2578063dd62ed3e146101c5576100cf565b806342966c681461015c57806370a082311461017157806379cc679014610184576100cf565b806306fdde03146100d4578063095ea7b3146100f257806318160ddd1461011557806323b872dd14610127578063313ce5671461013a5780633950935114610149575b600080fd5b6100dc6101fe565b6040516100e99190610a1f565b60405180910390f35b6101056101003660046109de565b610290565b60405190151581526020016100e9565b6002545b6040519081526020016100e9565b6101056101353660046109a3565b6102a6565b604051601281526020016100e9565b6101056101573660046109de565b610355565b61016f61016a366004610a07565b610391565b005b61011961017f366004610950565b61039e565b61016f6101923660046109de565b6103bd565b6100dc610443565b6101056101ad3660046109de565b610452565b6101056101c03660046109de565b6104eb565b6101196101d3366004610971565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b60606003805461020d90610aa1565b80601f016020809104026020016040519081016040528092919081815260200182805461023990610aa1565b80156102865780601f1061025b57610100808354040283529160200191610286565b820191906000526020600020905b81548152906001019060200180831161026957829003601f168201915b5050505050905090565b600061029d3384846104f8565b50600192915050565b60006102b384848461061c565b6001600160a01b03841660009081526001602090815260408083203384529091529020548281101561033d5760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e74206578636565647320616044820152676c6c6f77616e636560c01b60648201526084015b60405180910390fd5b61034a85338584036104f8565b506001949350505050565b3360008181526001602090815260408083206001600160a01b0387168452909152812054909161029d91859061038c908690610a72565b6104f8565b61039b33826107eb565b50565b6001600160a01b0381166000908152602081905260409020545b919050565b60006103c983336101d3565b9050818110156104275760405162461bcd60e51b8152602060048201526024808201527f45524332303a206275726e20616d6f756e74206578636565647320616c6c6f77604482015263616e636560e01b6064820152608401610334565b61043483338484036104f8565b61043e83836107eb565b505050565b60606004805461020d90610aa1565b3360009081526001602090815260408083206001600160a01b0386168452909152812054828110156104d45760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610334565b6104e133858584036104f8565b5060019392505050565b600061029d33848461061c565b6001600160a01b03831661055a5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610334565b6001600160a01b0382166105bb5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610334565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b0383166106805760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610334565b6001600160a01b0382166106e25760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610334565b6001600160a01b0383166000908152602081905260409020548181101561075a5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610334565b6001600160a01b03808516600090815260208190526040808220858503905591851681529081208054849290610791908490610a72565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516107dd91815260200190565b60405180910390a350505050565b6001600160a01b03821661084b5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b6064820152608401610334565b6001600160a01b038216600090815260208190526040902054818110156108bf5760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b6064820152608401610334565b6001600160a01b03831660009081526020819052604081208383039055600280548492906108ee908490610a8a565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a361043e565b80356001600160a01b03811681146103b857600080fd5b600060208284031215610961578081fd5b61096a82610939565b9392505050565b60008060408385031215610983578081fd5b61098c83610939565b915061099a60208401610939565b90509250929050565b6000806000606084860312156109b7578081fd5b6109c084610939565b92506109ce60208501610939565b9150604084013590509250925092565b600080604083850312156109f0578182fd5b6109f983610939565b946020939093013593505050565b600060208284031215610a18578081fd5b5035919050565b6000602080835283518082850152825b81811015610a4b57858101830151858201604001528201610a2f565b81811115610a5c5783604083870101525b50601f01601f1916929092016040019392505050565b60008219821115610a8557610a85610adc565b500190565b600082821015610a9c57610a9c610adc565b500390565b600181811c90821680610ab557607f821691505b60208210811415610ad657634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220c995b6d7561dfa01ff5fc93fed37a5f4055e1088c624495f4f74094ef51b78fb64736f6c63430008030033";

type ERC20PresetFixedSupplyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC20PresetFixedSupplyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC20PresetFixedSupply__factory extends ContractFactory {
  constructor(...args: ERC20PresetFixedSupplyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    name: string,
    symbol: string,
    initialSupply: BigNumberish,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC20PresetFixedSupply> {
    return super.deploy(
      name,
      symbol,
      initialSupply,
      owner,
      overrides || {}
    ) as Promise<ERC20PresetFixedSupply>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    initialSupply: BigNumberish,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      name,
      symbol,
      initialSupply,
      owner,
      overrides || {}
    );
  }
  attach(address: string): ERC20PresetFixedSupply {
    return super.attach(address) as ERC20PresetFixedSupply;
  }
  connect(signer: Signer): ERC20PresetFixedSupply__factory {
    return super.connect(signer) as ERC20PresetFixedSupply__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC20PresetFixedSupplyInterface {
    return new utils.Interface(_abi) as ERC20PresetFixedSupplyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC20PresetFixedSupply {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ERC20PresetFixedSupply;
  }
}
