import { observable } from "mobx";
import { CowSdk, OrderKind, SupportedChainId } from "@cowprotocol/cow-sdk";
import { Signer } from "@ethersproject/abstract-signer";
import { FeeQuoteParams, GetOrdersParams, SimpleGetQuoteResponse } from "@cowprotocol/cow-sdk/dist/api/cow/types";
import { CowApi } from "@cowprotocol/cow-sdk/dist/api";
import AppStore from "./App.store";
import { OrderCreation, UnsignedOrder } from "@cowprotocol/cow-sdk/dist/utils/sign";
import { QuoteMetadata } from "@cowprotocol/cow-sdk/dist/api/metadata/types";

class CowStore {
  @observable
  private client?: CowSdk<SupportedChainId.MAINNET>;

  @observable
  private api?: CowApi;

  static BASE_EXPLORER_URL = "https://explorer.cow.fi/mainnet/orders";

  connect(signer: Signer) {
    //@ts-ignore
    this.client = new CowSdk<SupportedChainId.MAINNET>(SupportedChainId.MAINNET, { signer: signer });
    this.api = this.client.cowApi;
  }

  private getQuote(params: FeeQuoteParams) {
    return this.api?.getQuote(params);
  }

  public getOrders(params: GetOrdersParams) {
    return this.api?.getOrders(params);
  }

  private sendOrder(params: { order: Omit<OrderCreation, "appData">; owner: string }) {
    return this.api?.sendOrder(params);
  }

  private signOrder(order: Omit<UnsignedOrder, "appData">) {
    return this.client!.signOrder(order);
  }

  public async cancelOrder(orderId: string, ownerAddress: string) {
    const orderCancellation = await this.client!.signOrderCancellation(orderId);
    return this.api?.sendSignedOrderCancellation({
      chainId: SupportedChainId.MAINNET,
      //@ts-ignore
      order: orderCancellation,
      owner: ownerAddress,
    });
  }

  public async acceptSimpleQuote(quote: SimpleGetQuoteResponse) {
    const order: UnsignedOrder = {
      partiallyFillable: false,
      appData: "0x0000000000000000000000000000000000000000000000000000000000000000",
      kind: quote.quote.kind,
      sellAmount: quote.quote.sellAmount,
      buyAmount: quote.quote.buyAmount,
      validTo: Number(quote.quote.validTo),
      feeAmount: quote.quote.feeAmount,
      sellToken: quote.quote.sellToken,
      buyToken: quote.quote.buyToken,
      receiver: quote.from,
    };
    const signedOrder = await this.signOrder(order);
    if (!signedOrder.signature) {
      throw new Error("Could not get signature");
    }
    //@ts-ignore
    const payload: Omit<OrderCreation, "appData"> = { ...order, ...signedOrder };
    const orderId = await this.sendOrder({
      order: payload,
      owner: quote.from,
    });
    return orderId;
  }

  public getQuoteForPixels({
    sellAddress,
    pixelCount,
    userAddress,
  }: {
    sellAddress: string;
    pixelCount: string | number;
    userAddress: string;
  }) {
    let validTo = new Date();
    validTo.setHours(validTo.getHours() + 1);
    const validToSeconds = Math.floor(validTo.getTime() / 1000);
    const amount = AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(pixelCount).toString();
    return this.getQuote({
      kind: OrderKind.BUY,
      buyToken: AppStore.web3.dogContractAddress,
      sellToken: sellAddress,
      validTo: validToSeconds,
      userAddress,
      amount,
    });
  }

  private getAppData(quote: QuoteMetadata) {
    return this.client!.metadataApi.generateAppDataDoc(
      {
        referrer: {
          address: AppStore.web3.address!,
          version: "2.0",
        },
        quote,
      },
      {
        appCode: "DogePixelPortal",
      },
    );
  }
}

export default CowStore;
