import { Box, Flex, Image } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { useNetwork } from "wagmi";
import Button, { ConnectWalletButton } from "../DSL/Button/Button";
import Link from "../DSL/Link/Link";
import Typography, { TVariant } from "../DSL/Typography/Typography";
import Dev from "../common/Dev";
import { getEtherscanURL } from "../helpers/links";
import { formatWithThousandsSeparators } from "../helpers/numberFormatter";
import { abbreviate } from "../helpers/strings";
import Doge from "../images/smirk.png";
import { targetChain } from "../services/wagmi";
import AppStore from "../store/App.store";
import FreeMoneyPageStore from "../store/FreeMoneyPage.store";

const FreeMoneyPage = observer(() => {
  const store = useMemo(() => new FreeMoneyPageStore(), []);
  useEffect(() => {
    store.init();
    return () => {
      store.destroy();
    };
  }, []);
  const { chain } = useNetwork();

  return (
    <Flex justifyContent={"center"} alignItems={"center"} w={"full"} flexDir={"column"}>
      {AppStore.web3.isConnected && (
        <>
          <Flex grow={1} alignItems={"center"}>
            {!chain?.unsupported && (
              <Box>
                {store.canGetFreeMoney && (
                  <Button size={"lg"} onClick={() => store.getFreeMoney()} isLoading={store.isLoading}>
                    <Box w={"full"} h={"full"}>
                      Get $DOG
                    </Box>
                  </Button>
                )}
                {!store.canGetFreeMoney && (
                  <Flex alignItems={"center"} flexDir={"column"} gap={6}>
                    <Image src={Doge} maxHeight={190} />
                    <Typography variant={TVariant.PresStart20} textAlign={"center"}>
                      wow, you own part of the most famous meme in the universe
                    </Typography>
                    <Box>
                      {store.myTxId && (
                        <Link isExternal to={getEtherscanURL(store.myTxId, "tx")}>
                          {abbreviate(store.myTxId)}
                        </Link>
                      )}
                    </Box>
                  </Flex>
                )}
              </Box>
            )}
          </Flex>
          <Dev>
            <Flex gap={1}>
              <Typography variant={TVariant.ComicSans14}>balance:</Typography>
              <Typography variant={TVariant.ComicSans14}>{formatWithThousandsSeparators(store.balance)}</Typography>
            </Flex>
          </Dev>
        </>
      )}
      {!AppStore.web3.isConnected && (
        <Flex flexDir={"column"} gap={6}>
          <ConnectWalletButton />
          {!chain?.unsupported && <Typography variant={TVariant.PresStart16}>to get free $DOG</Typography>}
          {chain?.unsupported && (
            <Typography variant={TVariant.PresStart16}>
              swap to {targetChain.name} to get infinte free dog money
            </Typography>
          )}
        </Flex>
      )}
    </Flex>
  );
});

export default FreeMoneyPage;
