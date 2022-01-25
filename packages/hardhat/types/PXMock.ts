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

export interface PXMockInterface extends ethers.utils.Interface {
  functions: {
    "BASE_URI()": FunctionFragment;
    "DOG20()": FunctionFragment;
    "DOG_TO_PIXEL_SATOSHIS()": FunctionFragment;
    "INDEX_OFFSET()": FunctionFragment;
    "MAGIC_NULL()": FunctionFragment;
    "SHIBA_HEIGHT()": FunctionFragment;
    "SHIBA_WIDTH()": FunctionFragment;
    "__PXMock_init(string,string,address,string,uint256,uint256,address,address)": FunctionFragment;
    "__PX_init(string,string,address,string,uint256,uint256,address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "burnPuppers(uint256[])": FunctionFragment;
    "getApproved(uint256)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "mintPuppers(uint256)": FunctionFragment;
    "name()": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "pupperToPixel(uint256)": FunctionFragment;
    "pupperToPixelCoords(uint256)": FunctionFragment;
    "puppersRemaining()": FunctionFragment;
    "randYish()": FunctionFragment;
    "safeTransferFrom(address,address,uint256)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "setDOG_TO_PIXEL_SATOSHIS(uint256)": FunctionFragment;
    "setSupply(uint256,uint256)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "symbol()": FunctionFragment;
    "tokenURI(uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "BASE_URI", values?: undefined): string;
  encodeFunctionData(functionFragment: "DOG20", values?: undefined): string;
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
    functionFragment: "SHIBA_HEIGHT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "SHIBA_WIDTH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "__PXMock_init",
    values: [
      string,
      string,
      string,
      string,
      BigNumberish,
      BigNumberish,
      string,
      string
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "__PX_init",
    values: [
      string,
      string,
      string,
      string,
      BigNumberish,
      BigNumberish,
      string,
      string
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "burnPuppers",
    values: [BigNumberish[]]
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
    functionFragment: "mintPuppers",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
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
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setDOG_TO_PIXEL_SATOSHIS",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setSupply",
    values: [BigNumberish, BigNumberish]
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

  decodeFunctionResult(functionFragment: "BASE_URI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "DOG20", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "DOG_TO_PIXEL_SATOSHIS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "INDEX_OFFSET",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "MAGIC_NULL", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "SHIBA_HEIGHT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "SHIBA_WIDTH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "__PXMock_init",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "__PX_init", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "burnPuppers",
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
  decodeFunctionResult(
    functionFragment: "mintPuppers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
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
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDOG_TO_PIXEL_SATOSHIS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setSupply", data: BytesLike): Result;
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

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "ApprovalForAll(address,address,bool)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
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

export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  { from: string; to: string; tokenId: BigNumber }
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface PXMock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PXMockInterface;

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
    BASE_URI(overrides?: CallOverrides): Promise<[string]>;

    DOG20(overrides?: CallOverrides): Promise<[string]>;

    DOG_TO_PIXEL_SATOSHIS(overrides?: CallOverrides): Promise<[BigNumber]>;

    INDEX_OFFSET(overrides?: CallOverrides): Promise<[BigNumber]>;

    MAGIC_NULL(overrides?: CallOverrides): Promise<[BigNumber]>;

    SHIBA_HEIGHT(overrides?: CallOverrides): Promise<[BigNumber]>;

    SHIBA_WIDTH(overrides?: CallOverrides): Promise<[BigNumber]>;

    __PXMock_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      ipfsUri_: string,
      width_: BigNumberish,
      height_: BigNumberish,
      DOG20_FEES_ADDRESS_DEV_: string,
      DOG20_FEES_ADDRESS_PLEASR_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    __PX_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      ipfsUri_: string,
      width_: BigNumberish,
      height_: BigNumberish,
      DOG20_FEES_ADDRESS_DEV_: string,
      DOG20_FEES_ADDRESS_PLEASR_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    burnPuppers(
      puppers: BigNumberish[],
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

    mintPuppers(
      qty: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    name(overrides?: CallOverrides): Promise<[string]>;

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

    setDOG_TO_PIXEL_SATOSHIS(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSupply(
      width: BigNumberish,
      height: BigNumberish,
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
  };

  BASE_URI(overrides?: CallOverrides): Promise<string>;

  DOG20(overrides?: CallOverrides): Promise<string>;

  DOG_TO_PIXEL_SATOSHIS(overrides?: CallOverrides): Promise<BigNumber>;

  INDEX_OFFSET(overrides?: CallOverrides): Promise<BigNumber>;

  MAGIC_NULL(overrides?: CallOverrides): Promise<BigNumber>;

  SHIBA_HEIGHT(overrides?: CallOverrides): Promise<BigNumber>;

  SHIBA_WIDTH(overrides?: CallOverrides): Promise<BigNumber>;

  __PXMock_init(
    name_: string,
    symbol_: string,
    DOG20Address: string,
    ipfsUri_: string,
    width_: BigNumberish,
    height_: BigNumberish,
    DOG20_FEES_ADDRESS_DEV_: string,
    DOG20_FEES_ADDRESS_PLEASR_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  __PX_init(
    name_: string,
    symbol_: string,
    DOG20Address: string,
    ipfsUri_: string,
    width_: BigNumberish,
    height_: BigNumberish,
    DOG20_FEES_ADDRESS_DEV_: string,
    DOG20_FEES_ADDRESS_PLEASR_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  burnPuppers(
    puppers: BigNumberish[],
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

  mintPuppers(
    qty: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  name(overrides?: CallOverrides): Promise<string>;

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

  setDOG_TO_PIXEL_SATOSHIS(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSupply(
    width: BigNumberish,
    height: BigNumberish,
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

  callStatic: {
    BASE_URI(overrides?: CallOverrides): Promise<string>;

    DOG20(overrides?: CallOverrides): Promise<string>;

    DOG_TO_PIXEL_SATOSHIS(overrides?: CallOverrides): Promise<BigNumber>;

    INDEX_OFFSET(overrides?: CallOverrides): Promise<BigNumber>;

    MAGIC_NULL(overrides?: CallOverrides): Promise<BigNumber>;

    SHIBA_HEIGHT(overrides?: CallOverrides): Promise<BigNumber>;

    SHIBA_WIDTH(overrides?: CallOverrides): Promise<BigNumber>;

    __PXMock_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      ipfsUri_: string,
      width_: BigNumberish,
      height_: BigNumberish,
      DOG20_FEES_ADDRESS_DEV_: string,
      DOG20_FEES_ADDRESS_PLEASR_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    __PX_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      ipfsUri_: string,
      width_: BigNumberish,
      height_: BigNumberish,
      DOG20_FEES_ADDRESS_DEV_: string,
      DOG20_FEES_ADDRESS_PLEASR_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    burnPuppers(
      puppers: BigNumberish[],
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

    mintPuppers(qty: BigNumberish, overrides?: CallOverrides): Promise<void>;

    name(overrides?: CallOverrides): Promise<string>;

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

    setDOG_TO_PIXEL_SATOSHIS(
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setSupply(
      width: BigNumberish,
      height: BigNumberish,
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
    BASE_URI(overrides?: CallOverrides): Promise<BigNumber>;

    DOG20(overrides?: CallOverrides): Promise<BigNumber>;

    DOG_TO_PIXEL_SATOSHIS(overrides?: CallOverrides): Promise<BigNumber>;

    INDEX_OFFSET(overrides?: CallOverrides): Promise<BigNumber>;

    MAGIC_NULL(overrides?: CallOverrides): Promise<BigNumber>;

    SHIBA_HEIGHT(overrides?: CallOverrides): Promise<BigNumber>;

    SHIBA_WIDTH(overrides?: CallOverrides): Promise<BigNumber>;

    __PXMock_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      ipfsUri_: string,
      width_: BigNumberish,
      height_: BigNumberish,
      DOG20_FEES_ADDRESS_DEV_: string,
      DOG20_FEES_ADDRESS_PLEASR_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    __PX_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      ipfsUri_: string,
      width_: BigNumberish,
      height_: BigNumberish,
      DOG20_FEES_ADDRESS_DEV_: string,
      DOG20_FEES_ADDRESS_PLEASR_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    burnPuppers(
      puppers: BigNumberish[],
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

    mintPuppers(
      qty: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

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

    setDOG_TO_PIXEL_SATOSHIS(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSupply(
      width: BigNumberish,
      height: BigNumberish,
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
  };

  populateTransaction: {
    BASE_URI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DOG20(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DOG_TO_PIXEL_SATOSHIS(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    INDEX_OFFSET(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MAGIC_NULL(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    SHIBA_HEIGHT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    SHIBA_WIDTH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    __PXMock_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      ipfsUri_: string,
      width_: BigNumberish,
      height_: BigNumberish,
      DOG20_FEES_ADDRESS_DEV_: string,
      DOG20_FEES_ADDRESS_PLEASR_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    __PX_init(
      name_: string,
      symbol_: string,
      DOG20Address: string,
      ipfsUri_: string,
      width_: BigNumberish,
      height_: BigNumberish,
      DOG20_FEES_ADDRESS_DEV_: string,
      DOG20_FEES_ADDRESS_PLEASR_: string,
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

    burnPuppers(
      puppers: BigNumberish[],
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

    mintPuppers(
      qty: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

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

    setDOG_TO_PIXEL_SATOSHIS(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSupply(
      width: BigNumberish,
      height: BigNumberish,
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
  };
}
