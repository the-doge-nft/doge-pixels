import { observer } from "mobx-react-lite";
import Icon from "../../DSL/Icon/Icon";
import Link from "../../DSL/Link/Link";
import { isDevModeEnabled, isStaging } from "../../environment/helpers";
import AppStore from "../../store/App.store";

interface OpenSeaLinkProps {
  pixelId: number | string;
}

const OpenSeaLink: React.FC<OpenSeaLinkProps> = observer(({ pixelId }) => {
  return (
    <Link
      opacity={0.5}
      target={"_blank"}
      size={"sm"}
      href={
        isDevModeEnabled() || isStaging()
          ? `https://testnets.opensea.io/assets/${AppStore.web3.pxContractAddress}/${pixelId}`
          : `https://opensea.io/assets/${AppStore.web3.pxContractAddress}/${pixelId}`
      }
    >
      <Icon fill={"white"} icon={"openSea"} boxSize={5} />
    </Link>
  );
});

export default OpenSeaLink;
