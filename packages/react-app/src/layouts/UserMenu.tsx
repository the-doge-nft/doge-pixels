import React from "react";
import { Box, Flex, Menu, MenuButton, MenuItem, MenuList, useColorMode, useMultiStyleConfig } from "@chakra-ui/react";
import Typography, { TVariant } from "../DSL/Typography/Typography";
import AppStore from "../store/App.store";
import { observer } from "mobx-react-lite";
import { formatWithThousandsSeparators } from "../helpers/numberFormatter";
import { ethers } from "ethers";
import Dev from "../common/Dev";
import { showDebugToast, showErrorToast } from "../DSL/Toast/Toast";
import { lightOrDarkMode } from "../DSL/Theme";

const UserMenu = observer(() => {
  const styles = useMultiStyleConfig("Menu", {});
  const { colorMode } = useColorMode();
  return (
    <Menu>
      <Box position={"relative"} zIndex={1}>
        <MenuButton overflow={"hidden"}>
          <Flex alignItems={"center"} overflow={"hidden"} mx={1}>
            <Typography
              variant={TVariant.PresStart14}
              maxW={"200px"}
              overflowX={"hidden"}
              overflowWrap={"initial"}
              textOverflow={"ellipsis"}
            >
              {AppStore.web3.addressForDisplay}
            </Typography>
          </Flex>
        </MenuButton>
        <Box __css={styles.drop} />
      </Box>

      <MenuList maxWidth={"fit-content"}>
        <Balances />
        <MenuItem mt={8} onClick={() => AppStore.web3.disconnect()}>
          <Typography variant={TVariant.PresStart12}>Disconnect {">"}</Typography>
        </MenuItem>
        <Flex mt={1} px={3} alignItems={"center"}>
          <Typography color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")} variant={TVariant.PresStart10}>
            connected: {AppStore.web3.network?.name}
          </Typography>
        </Flex>
      </MenuList>
    </Menu>
  );
});

const Balances = observer(function Balances() {
  return (
    <Box px={3}>
      {AppStore.web3.web3Provider && (
        <>
          <Box>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Typography variant={TVariant.PresStart15}>DOG</Typography>
              <Dev>
                <Flex>
                  <Box
                    mr={1}
                    _hover={{ cursor: "pointer" }}
                    onClick={async () => {
                      try {
                        const tx = await AppStore.web3.getDogToAccount();
                        await tx.wait();
                        showDebugToast("Free DOG aquired");
                        AppStore.web3.refreshDogBalance();
                      } catch (e) {
                        console.error(e);
                        showErrorToast("Error getting free DOG");
                      }
                    }}
                  >
                    💰
                  </Box>
                  <Box ml={1} _hover={{ cursor: "pointer" }} onClick={async () => AppStore.web3.refreshDogBalance()}>
                    🔄
                  </Box>
                </Flex>
              </Dev>
            </Flex>
            <Typography variant={TVariant.ComicSans18} mt={1} block>
              {AppStore.web3.dogBalance !== null
                ? formatWithThousandsSeparators(ethers.utils.formatEther(AppStore.web3.dogBalance), 0)
                : 0}
            </Typography>
          </Box>
          <Box mt={4}>
            <Box>
              <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Typography variant={TVariant.PresStart15}>Pixels</Typography>
                <Dev>
                  <Box onClick={async () => AppStore.web3.refreshPupperBalance()}>🔄</Box>
                </Dev>
              </Flex>
            </Box>
            <Typography variant={TVariant.ComicSans18} mt={1} block>
              {AppStore.web3.pupperBalance === 0 ? "None 😕" : AppStore.web3.pupperBalance}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
});

export default UserMenu;
