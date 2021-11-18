/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface PXInterface extends ethers.utils.Interface {
  functions: {
    "DOG_TO_PIXEL_SATOSHIS()": FunctionFragment;
    "INDEX_OFFSET()": FunctionFragment;
    "MAGIC_NULL()": FunctionFragment;
    "__PX_init(string,string,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "burnPupper(uint256)": FunctionFragment;
    "fuelPuppyDispenser(uint256)": FunctionFragment;
    "getApproved(uint256)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "mintPupper()": FunctionFragment;
    "mintPuppers(uint256)": FunctionFragment;
    "name()": FunctionFragment;
    "owner()": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "pupperToPixel(uint256)": FunctionFragment;
    "pupperToPixelCoords(uint256)": FunctionFragment;
    "puppersRemaining()": FunctionFragment;
    "randYish()": FunctionFragment;
    "randYishInRange(uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "safeTransferFrom(address,address,uint256)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "symbol()": FunctionFragment;
    "tokenURI(uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "DOG_TO_PIXEL_SATOSHIS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "INDEX_OFFSET",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MAGIC_NULL",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "__PX_init",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "burnPupper",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "fuelPuppyDispenser",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "mintPupper",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mintPuppers",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pupperToPixel",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pupperToPixelCoords",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "puppersRemaining",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "randYish", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "randYishInRange",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "DOG_TO_PIXEL_SATOSHIS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "INDEX_OFFSET",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "MAGIC_NULL", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "__PX_init", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burnPupper", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "fuelPuppyDispenser",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mintPupper", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "mintPuppers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pupperToPixel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pupperToPixelCoords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "puppersRemaining",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "randYish", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "randYishInRange",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "ApprovalForAll(address,address,bool)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  { owner: string; approved: string; tokenId: BigNumber }
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean],
  { owner: string; operator: string; approved: boolean }
>;

export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  { from: string; to: string; tokenId: BigNumber }
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface PX extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PXInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    DOG_TO_PIXEL_SATOSHIS(overrides?: CallOverrides): Promise<[BigNumber]>;

    INDEX_OFFSET(overrides?: CallOverrides): Promise<[BigNumber]>;

    MAGIC_NULL(overrides?: CallOverrides): Promise<[BigNumber]>;

    __PX_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    burnPupper(
      pupper: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fuelPuppyDispenser(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    mintPupper(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    mintPuppers(
      qty: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    name(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    pupperToPixel(
      pupper: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    pupperToPixelCoords(
      pupper: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[[BigNumber, BigNumber]]>;

    puppersRemaining(overrides?: CallOverrides): Promise<[BigNumber]>;

    randYish(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { ret: BigNumber }>;

    randYishInRange(
      maxRand: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { ret: BigNumber }>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  DOG_TO_PIXEL_SATOSHIS(overrides?: CallOverrides): Promise<BigNumber>;

  INDEX_OFFSET(overrides?: CallOverrides): Promise<BigNumber>;

  MAGIC_NULL(overrides?: CallOverrides): Promise<BigNumber>;

  __PX_init(
    name_: string,
    symbol_: string,
    DOG20Address: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  burnPupper(
    pupper: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fuelPuppyDispenser(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getApproved(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  mintPupper(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  mintPuppers(
    qty: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  name(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  pupperToPixel(
    pupper: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  pupperToPixelCoords(
    pupper: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  puppersRemaining(overrides?: CallOverrides): Promise<BigNumber>;

  randYish(overrides?: CallOverrides): Promise<BigNumber>;

  randYishInRange(
    maxRand: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256,bytes)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  symbol(overrides?: CallOverrides): Promise<string>;

  tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    DOG_TO_PIXEL_SATOSHIS(overrides?: CallOverrides): Promise<BigNumber>;

    INDEX_OFFSET(overrides?: CallOverrides): Promise<BigNumber>;

    MAGIC_NULL(overrides?: CallOverrides): Promise<BigNumber>;

    __PX_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      overrides?: CallOverrides
    ): Promise<void>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    burnPupper(pupper: BigNumberish, overrides?: CallOverrides): Promise<void>;

    fuelPuppyDispenser(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    mintPupper(overrides?: CallOverrides): Promise<BigNumber>;

    mintPuppers(qty: BigNumberish, overrides?: CallOverrides): Promise<void>;

    name(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    pupperToPixel(
      pupper: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pupperToPixelCoords(
      pupper: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    puppersRemaining(overrides?: CallOverrides): Promise<BigNumber>;

    randYish(overrides?: CallOverrides): Promise<BigNumber>;

    randYishInRange(
      maxRand: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    symbol(overrides?: CallOverrides): Promise<string>;

    tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): ApprovalEventFilter;
    Approval(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): ApprovalEventFilter;

    "ApprovalForAll(address,address,bool)"(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;
    ApprovalForAll(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TransferEventFilter;
    Transfer(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TransferEventFilter;
  };

  estimateGas: {
    DOG_TO_PIXEL_SATOSHIS(overrides?: CallOverrides): Promise<BigNumber>;

    INDEX_OFFSET(overrides?: CallOverrides): Promise<BigNumber>;

    MAGIC_NULL(overrides?: CallOverrides): Promise<BigNumber>;

    __PX_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    burnPupper(
      pupper: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fuelPuppyDispenser(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    mintPupper(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    mintPuppers(
      qty: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pupperToPixel(
      pupper: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pupperToPixelCoords(
      pupper: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    puppersRemaining(overrides?: CallOverrides): Promise<BigNumber>;

    randYish(overrides?: CallOverrides): Promise<BigNumber>;

    randYishInRange(
      maxRand: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DOG_TO_PIXEL_SATOSHIS(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    INDEX_OFFSET(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MAGIC_NULL(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    __PX_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burnPupper(
      pupper: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fuelPuppyDispenser(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mintPupper(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    mintPuppers(
      qty: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pupperToPixel(
      pupper: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pupperToPixelCoords(
      pupper: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    puppersRemaining(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    randYish(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    randYishInRange(
      maxRand: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}