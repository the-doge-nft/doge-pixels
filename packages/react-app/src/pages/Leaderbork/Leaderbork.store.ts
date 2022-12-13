import { ethers } from "ethers";
import { action, computed, makeObservable, observable } from "mobx";
import { generatePath } from "react-router-dom";
import { arrayFuzzyFilterByKey } from "../../helpers/arrays";
import { EmptyClass } from "../../helpers/mixins";
import { abbreviate } from "../../helpers/strings";
import { Http } from "../../services";
import { Reactionable } from "../../services/mixins/reactionable";
import AppStore from "../../store/App.store";
import { sleep } from "./../../helpers/sleep";

export interface PixelOwnerInfo {
  address: string;
  pixels: number[];
  ens: string | null;
  ud: string | null;
}

interface PixelTransfer {
  id: number;
  from: {
    address: string;
    ens: string | null;
    ud: string | null;
  };
  insertedAt: string;
  to: {
    address: string;
    ens: string | null;
    ud: string | null;
  };
  tokenId: number;
  uniqueTransferId: string;
  updatedAt: string;
  blockNumber: number;
  blockCreatedAt: string;
}

export enum SelectedOwnerTab {
  Wallet = "wallet",
  Activity = "activity",
}

class LeaderborkStore extends Reactionable(EmptyClass) {
  @observable
  searchValue = "";

  @observable
  selectedAddress?: string;

  @observable
  selectedPixelId: number | null = null;

  @observable
  selectedTransferId: string | null = null;

  @observable
  lockedDog: number | null = null;

  @observable
  globalTransfers: PixelTransfer[] = [];

  @observable
  selectedOwnerTransfers: PixelTransfer[] = [];

  @observable
  selectedOwnerTab: SelectedOwnerTab = SelectedOwnerTab.Activity;

  @observable
  paginableCount = 20;

  constructor(
    selectedAddress?: string,
    selectedPixelId?: number,
    transferId?: string,
    selectedOwnerTab?: SelectedOwnerTab,
  ) {
    super();
    makeObservable(this);

    if (selectedAddress) {
      this.searchValue = selectedAddress;
      this.selectedAddress = selectedAddress;
      this.getSelectedUserTransfers();
    }

    if (selectedPixelId) {
      this.selectedPixelId = selectedPixelId;
    }

    if (transferId) {
      this.selectedTransferId = transferId;
    }

    if (selectedOwnerTab) {
      this.selectedOwnerTab = selectedOwnerTab;
    }

    this.react(
      () => this.searchValue,
      (value, prevValue) => {
        //@ts-ignore
        if ((this.selectedAddress && value.length === prevValue.length - 1) || value === "") {
          this.selectedAddress = undefined;
          this.searchValue = "";
        }

        if (this.searchValue === "") {
          this.getGlobalTransfers();
        }
      },
    );

    this.react(
      () => [this.selectedOwner],
      () => {
        if (this.selectedOwner && !this.selectedPixelId) {
          this.selectedPixelId = this.selectedOwner.pixels?.[0];
          this.getSelectedUserTransfers().then(_ => {
            if (!this.selectedTransferId) {
              this.selectedTransferId = this.selectedOwnerTransfers[0]?.uniqueTransferId;
            }
          });
        }
      },
    );
  }

  init() {
    AppStore.web3.getDogLocked().then(balance => {
      this.lockedDog = Number(balance);
    });
    AppStore.web3.getPixelOwnershipMap();
    if (!this.selectedAddress) {
      this.getGlobalTransfers().then(_ => {
        this.selectedTransferId = this.globalTransfers[0]?.uniqueTransferId;
      });
    }
  }

  @computed
  get ownersTypeaheadItems() {
    const addresses = Object.keys(AppStore.web3.addressToPuppers).map(address => ({
      value: address,
      name: AppStore.web3.addressToPuppers[address]?.ens ? AppStore.web3.addressToPuppers[address]?.ens : address,
    }));
    return arrayFuzzyFilterByKey(addresses, this.searchValue, "name").slice(0, 10);
  }

  @computed
  get selectedOwner(): PixelOwnerInfo | undefined {
    return AppStore.web3.sortedPixelOwners.filter(owner => owner.address === this.selectedAddress)?.[0];
  }

  @computed
  get selectedAddressDisplayName() {
    if (this.selectedAddress) {
      if (this.selectedOwner?.ens) {
        return this.selectedOwner.ens;
      } else {
        return abbreviate(this.selectedAddress);
      }
    }
    return "None";
  }

  @computed
  get selectedActivityTokenId() {
    return this.selectedActivityTransfer?.tokenId;
  }

  @computed
  get selectedActivityTransferDetails() {
    let title;
    let description;
    if (this.selectedActivityTransfer.from.address === ethers.constants.AddressZero) {
      title = "Minted";
      description = {
        to: {
          address: this.selectedActivityTransfer.to.address,
          displayName: AppStore.web3.getAddressDisplayName(this.selectedActivityTransfer.to.address),
        },
        from: null,
      };
    } else if (this.selectedActivityTransfer.to.address === ethers.constants.AddressZero) {
      title = "Burned";
      description = {
        from: {
          address: this.selectedActivityTransfer.from.address,
          displayName: AppStore.web3.getAddressDisplayName(this.selectedActivityTransfer.from.address),
        },
        to: null,
      };
    } else {
      title = "Transfer";
      description = {
        from: {
          address: this.selectedActivityTransfer.from.address,
          displayName: AppStore.web3.getAddressDisplayName(this.selectedActivityTransfer.from.address),
        },
        to: {
          address: this.selectedActivityTransfer.to.address,
          displayName: AppStore.web3.getAddressDisplayName(this.selectedActivityTransfer.to.address),
        },
      };
    }
    return { title, description };
  }

  @action
  async setSelectedAddress(address: string) {
    this.selectedAddress = address;
    this.searchValue = this.selectedAddress;
    this.selectedOwnerTab = SelectedOwnerTab.Wallet;
    this.selectedPixelId = this.selectedOwner.pixels[0];
    this.getSelectedUserTransfers();
  }

  setSelectedPixelId(pixelId: number | null) {
    this.selectedPixelId = pixelId;
    this.pushWindowState(
      generatePath(`/leaderbork/:address/${SelectedOwnerTab.Wallet}/:tokenId`, {
        address: this.selectedAddress,
        tokenId: this.selectedPixelId,
      }),
    );
  }

  setActivityId(activityId: string) {
    this.selectedTransferId = activityId;
  }

  pushWindowState(route: string) {
    // helper to push window state without causing a rerender
    return window.history.pushState({}, "", route);
  }

  destroy() {
    return this.disposeReactions();
  }

  @computed
  get transfers() {
    if (this.selectedOwner) {
      return this.selectedOwnerTransfers;
    } else {
      return this.globalTransfers;
    }
  }

  @computed
  get selectedActivityTransfer(): PixelTransfer | undefined {
    if (this.selectedOwner) {
      return this.selectedOwnerTransfers.filter(transfer => transfer.uniqueTransferId === this.selectedTransferId)[0];
    } else {
      return this.globalTransfers.filter(transfer => transfer.uniqueTransferId === this.selectedTransferId)[0];
    }
  }

  getGlobalTransfers() {
    return Http.post<PixelTransfer[]>("/v1/transfers", {
      sort: {
        blockNumber: "desc",
      },
    }).then(({ data }) => {
      return (this.globalTransfers = data.slice(0, 20));
    });
  }

  getSelectedUserTransfers() {
    return Http.post(`/v1/transfers/${this.selectedAddress}`, {
      sort: {
        blockNumber: "desc",
      },
    }).then(({ data }) => {
      return (this.selectedOwnerTransfers = data);
    });
  }

  @computed
  get activityPaneTitle() {
    if (!this.selectedAddress) {
      return "Recent Activity";
    } else {
      if (this.selectedOwner) {
        return AppStore.web3.getAddressDisplayName(this.selectedOwner.address);
      }
      return "";
    }
  }

  setSelectedOwnerTab(tabType: SelectedOwnerTab) {
    this.selectedOwnerTab = tabType;
    if (this.selectedOwnerTab === SelectedOwnerTab.Wallet) {
      this.selectedPixelId = this.selectedOwner.pixels[0];
      this.pushWindowState(
        generatePath(`/leaderbork/:address/${SelectedOwnerTab.Wallet}/:tokenId`, {
          address: this.selectedAddress,
          tokenId: this.selectedPixelId,
        }),
      );
    } else if (this.selectedOwnerTab === SelectedOwnerTab.Activity) {
      this.selectedTransferId = this.selectedOwnerTransfers[0]?.uniqueTransferId;
      this.pushWindowState(
        generatePath(`/leaderbork/:address/${SelectedOwnerTab.Activity}/:activityId`, {
          address: this.selectedAddress,
          activityId: this.selectedTransferId,
        }),
      );
    } else {
      throw new Error("Unknown selected owner tab type");
    }
  }

  @computed
  get previewPixels() {
    if (this.selectedOwner) {
      return this.selectedOwner.pixels;
    } else {
      return [this.selectedActivityTokenId];
    }
  }

  @computed
  get previewSelectedPixelId() {
    if (this.selectedOwner) {
      if (this.selectedOwnerTab === SelectedOwnerTab.Activity) {
        return this.selectedActivityTokenId;
      } else {
        return this.selectedPixelId;
      }
    } else {
      return this.selectedActivityTokenId;
    }
  }

  @computed
  get showDetails() {
    return (
      (this.selectedPixelId && this.selectedOwnerTab === SelectedOwnerTab.Wallet) ||
      (this.selectedActivityTransfer && this.selectedOwnerTab === SelectedOwnerTab.Activity)
    );
  }

  @action
  async page() {
    const amountToPage = 20;
    // ~make it feel natural~ //
    await sleep(200);
    this.paginableCount += amountToPage;
  }

  @computed
  get pagableOwners() {
    if (AppStore.web3.sortedPixelOwners) {
      return [...AppStore.web3.sortedPixelOwners].splice(0, this.paginableCount);
    }
    return [];
  }

  @computed
  get hasMorePagableOwners() {
    return this.pagableOwners.length < AppStore.web3.sortedPixelOwners.length;
  }
}

export default LeaderborkStore;
