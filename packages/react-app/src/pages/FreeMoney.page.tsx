import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import Button, { ConnectWalletButton } from "../DSL/Button/Button";
import Typography, { TVariant } from "../DSL/Typography/Typography";
import { formatWithThousandsSeparators } from "../helpers/numberFormatter";
import AppStore from "../store/App.store";
import FreeMoneyPageStore from "../store/FreeMoneyPage.store";

const FreeMoneyPage = observer(() => {
  const store = useMemo(() => new FreeMoneyPageStore(), []);
  useEffect(() => {
    store.init();
  }, []);
  return (
    <Flex justifyContent={"center"} alignItems={"center"} w={"full"} flexDir={"column"}>
      {AppStore.web3.isConnected && (
        <>
          <Flex grow={1} alignItems={"center"}>
            <Box>
              <Button size={"lg"} onClick={() => store.getFreeMoney()}>
                <Box w={"full"} h={"full"}>
                  Get $DOG
                </Box>
              </Button>
            </Box>
          </Flex>
          <Flex gap={1}>
            <Typography variant={TVariant.ComicSans14}>balance:</Typography>
            <Typography variant={TVariant.ComicSans14}>{formatWithThousandsSeparators(store.balance)}</Typography>
          </Flex>
        </>
      )}
      {!AppStore.web3.isConnected && (
        <Flex flexDir={"column"} gap={6}>
          <ConnectWalletButton />
          <Typography variant={TVariant.PresStart16}>to get free $DOG</Typography>
        </Flex>
      )}
    </Flex>
  );
});

export default FreeMoneyPage;
