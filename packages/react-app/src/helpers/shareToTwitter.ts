import env from "../environment";
import { Http } from "../services";

export enum TwitterShareType {
  Mint = "mint",
  Burn = "burn",
  Art = "art",
  Claim = "claim",
}

const shareToTwitter = (data: any, message: string, type: TwitterShareType) => {
  Http.post("/v1/twitter/upload/image", { data })
    .then(({ data }) => {
      const { id } = data;
      const screenshotUrl = `${env.api.baseURL}/v1/twitter/share/${type}/${id}`;
      const text = encodeURIComponent(`${message}\n${screenshotUrl}`);
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    })
    .catch(e => {
      console.error(e);
    });
};

export default shareToTwitter;
