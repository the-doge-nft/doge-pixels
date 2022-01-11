import { Constructor } from "../../helpers/mixins";
import { computed, makeObservable, observable } from "mobx";
import { ObjectKeys } from "../../helpers/objects";

export interface QRData {
  amount: number;
  asset: string;
  label: string;
  note: string;
  wallet: string;
}

export function Scannable<T extends Constructor>(Base1: T) {
  abstract class Scannable extends Base1 {
    @observable
    qrData?: QRData;

    constructor(...rest: any[]) {
      super();
      makeObservable(this);
    }

    abstract queryQR(): Promise<any>;

    async getQR() {
      return this.queryQR().then(res => {
        this.qrData = res.data.qr_data;
      });
    }

    @computed
    get qrCode() {
      if (this.qrData) {
        return this.getAlgoQRCode(this.qrData);
      } else {
        return "";
      }
    }

    getAlgoQRCode(d: QRData) {
      const { wallet, ...data } = d;
      let url = `algorand://${wallet}?`;
      const params: any[] = [];
      ObjectKeys(data).forEach(key => {
        if (data[key] === null) {
          delete data[key];
          return;
        }
        params.push(`${key}=${encodeURIComponent(data[key])}`);
      });
      url += params.join("&");
      return url;
    }
  }

  return Scannable;
}
