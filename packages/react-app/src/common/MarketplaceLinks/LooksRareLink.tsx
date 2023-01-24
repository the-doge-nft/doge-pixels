import { observer } from "mobx-react-lite";
import Icon from "../../DSL/Icon/Icon";
import Link from "../../DSL/Link/Link";
import { isDevModeEnabled, isStaging } from "../../environment/helpers";
import AppStore from "../../store/App.store";

interface LooksRareLinkProps {
  pixelId: number | string;
}

const LooksRareLink: React.FC<LooksRareLinkProps> = observer(({ pixelId }) => {
  return (
    <Link
      opacity={0.5}
      target={"_blank"}
      size={"sm"}
      href={
        isDevModeEnabled() || isStaging()
          ? `https://goerli.looksrare.org/collections/${AppStore.web3.pxContractAddress}/${pixelId}`
          : `https://looksrare.org/collections/${AppStore.web3.pxContractAddress}/${pixelId}`
      }
    >
      <Icon icon={"looksRare"} boxSize={5} />
    </Link>
  );
});

export default LooksRareLink;
