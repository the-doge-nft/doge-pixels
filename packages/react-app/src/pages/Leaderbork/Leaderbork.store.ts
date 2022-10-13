import { computed, makeObservable, observable } from "mobx";
import AppStore from "../../store/App.store";
import { Reactionable } from "../../services/mixins/reactionable";
import { EmptyClass } from "../../helpers/mixins";
import { ethers } from "ethers";
import { abbreviate } from "../../helpers/strings";
import { Http } from "../../services";
import { generatePath } from "react-router-dom";

export interface PixelOwnerInfo {
  address: string;
  pixels: number[];
  ens: string | null;
}

interface PixelTransfer {
  id: number;
  from: {
    address: string;
    ens: string | null;
  };
  insertedAt: string;
  to: {
    address: string;
    ens: string | null;
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
      this.getSelectedUserTransfers()
    }

    if (selectedPixelId) {
      console.log("debug:: selected pixel id", selectedPixelId)
      this.selectedPixelId = selectedPixelId;
    }

    if (transferId) {
      this.selectedTransferId = transferId;
    }

    if (selectedOwnerTab) {
      console.log("debug:: selected owner tab", selectedOwnerTab)
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
    return AppStore.web3.sortedPixelOwners.map(item => ({
      value: item.address,
      name: item.ens ? item.ens : item.address,
    }));
  }

  @computed
  get selectedOwner(): PixelOwnerInfo | undefined {
    return AppStore.web3.sortedPixelOwners.filter(dog => dog.address === this.selectedAddress)[0];
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
          ens: this.selectedActivityTransfer.to.ens,
          displayName: this.selectedActivityTransfer.to.ens
            ? this.selectedActivityTransfer.to.ens
            : abbreviate(this.selectedActivityTransfer.to.address, 4),
        },
        from: null,
      };
    } else if (this.selectedActivityTransfer.to.address === ethers.constants.AddressZero) {
      title = "Burned";
      description = {
        from: {
          address: this.selectedActivityTransfer.from.address,
          ens: this.selectedActivityTransfer.from.ens,
          displayName: this.selectedActivityTransfer.from.ens
            ? this.selectedActivityTransfer.from.ens
            : abbreviate(this.selectedActivityTransfer.from.address, 4),
        },
        to: null,
      };
    } else {
      title = "Transfer";
      description = {
        from: {
          address: this.selectedActivityTransfer.from.address,
          ens: this.selectedActivityTransfer.from.ens,
          displayName: this.selectedActivityTransfer.from.ens
            ? this.selectedActivityTransfer.from.ens
            : abbreviate(this.selectedActivityTransfer.from.address, 4),
        },
        to: {
          address: this.selectedActivityTransfer.to.address,
          ens: this.selectedActivityTransfer.to.ens,
          displayName: this.selectedActivityTransfer.to.ens
            ? this.selectedActivityTransfer.to.ens
            : abbreviate(this.selectedActivityTransfer.to.address, 4),
        },
      };
    }
    return { title, description };
  }

  async setSelectedAddress(address: string) {
    this.selectedAddress = address;
    this.searchValue = this.selectedAddress;
    this.selectedOwnerTab = SelectedOwnerTab.Wallet;
    this.selectedPixelId = this.selectedOwner.pixels[0];
    this.pushWindowState(
      generatePath(`/leaderbork/:address/${SelectedOwnerTab.Wallet}/:tokenId`, {
        address: this.selectedAddress,
        tokenId: this.selectedPixelId,
      }),
    );
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
    if (this.selectedOwner) {
      this.pushWindowState(
        generatePath(`/leaderbork/:address/${SelectedOwnerTab.Activity}/:activityId`, {
          address: this.selectedAddress,
          activityId: this.selectedTransferId,
        }),
      );
    } else {
      this.pushWindowState(
        generatePath(`/leaderbork/${SelectedOwnerTab.Activity}/:activityId`, { activityId: this.selectedTransferId }),
      );
    }
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
      return (this.globalTransfers = data);
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
        return this.selectedOwner.ens ? this.selectedOwner.ens : abbreviate(this.selectedOwner.address, 4);
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
      console.log("debug:: TEST", this.selectedTransferId)
      this.pushWindowState(
        generatePath(`/leaderbork/:address/${SelectedOwnerTab.Activity}/:activityId`, {
          address: this.selectedAddress,
          activityId: this.selectedTransferId,
        }),
      );
    } else {
      throw new Error("Unknown selected owner tab type")
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
    return (this.selectedPixelId && this.selectedOwnerTab === SelectedOwnerTab.Wallet) ||
      (this.selectedActivityTransfer && this.selectedOwnerTab === SelectedOwnerTab.Activity)
  }
}

export default LeaderborkStore;
