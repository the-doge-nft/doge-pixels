import React from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useMultiStyleConfig
} from "@chakra-ui/react";
import Icon from "../DSL/Icon/Icon";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import AppStore from "../store/App.store";
import {observer} from "mobx-react-lite";
import {formatWithThousandsSeparators} from "../helpers/numberFormatter";
import {ethers} from "ethers";
import Dev from "../common/Dev";
import {showDebugToast, showErrorToast} from "../DSL/Toast/Toast";


const UserMenu = observer(() => {
  const styles = useMultiStyleConfig("Menu", {})
  return <Menu>
    <Box position={"relative"} zIndex={1}>
      <MenuButton overflow={"hidden"}>
        <Flex alignItems={"center"} overflow={"hidden"}>
          <Typography variant={TVariant.PresStart15} mr={2}>
            {AppStore.web3.addressForDisplay}
          </Typography>
          <Icon
            color={"white"}
            boxSize={5}
            icon={'person'}
          />
        </Flex>
      </MenuButton>
      <Box __css={styles.drop}/>
    </Box>

    <MenuList maxWidth={"fit-content"}>
      <Balances/>
      <Flex px={3} mt={8} mb={1} alignItems={"center"}>
        <Typography variant={TVariant.PresStart10}>
          connected:
        </Typography>
        <Typography variant={TVariant.PresStart10} ml={2} block>
          {AppStore.web3.network?.name}
        </Typography>
      </Flex>
      <MenuItem onClick={() => AppStore.web3.disconnect()}>
        <Typography variant={TVariant.PresStart15}>Disconnect {'>'}</Typography>
      </MenuItem>
    </MenuList>
  </Menu>
})

const Balances = observer(function Balances() {
  const {colorMode} = useColorMode()
  return <Grid px={3} mt={2} templateColumns={"1fr 1fr"}>
    {AppStore.web3.web3Provider && <>
        <GridItem mr={4} display={"flex"} flexDirection={"column"}>
            <Typography variant={TVariant.PresStart15}>DOG</Typography>
            <Typography variant={TVariant.ComicSans18} mt={1} block>
              {AppStore.web3.dogBalance !== null
                ? formatWithThousandsSeparators(ethers.utils.formatEther(AppStore.web3.dogBalance), 0)
                : 0}
            </Typography>
            <Dev>
                <Flex
                    flexDirection={"column"}
                    borderWidth={"1px"}
                    borderStyle={"solid"}
                    borderColor={colorMode === "light" ? "black" : "white"}
                    alignItems={"center"}
                    pb={2}>
                    <Flex alignItems={"center"} my={2}>
                        <Box
                            mr={1}
                            _hover={{cursor: "pointer"}}
                            onClick={async () => {
                              try {
                                const tx = await AppStore.web3.getDogToAccount()
                                await tx.wait()
                                showDebugToast("Free DOG aquired")
                                AppStore.web3.refreshDogBalance()
                              } catch (e) {
                                console.error(e)
                                showErrorToast("Error getting free DOG")
                              }
                            }}>
                            💰
                        </Box>
                        <Box
                            ml={1}
                            _hover={{cursor: "pointer"}}
                            onClick={async () => AppStore.web3.refreshDogBalance()}
                        >
                            🔄
                        </Box>
                    </Flex>
                    <Typography variant={TVariant.ComicSans10}>Dev tools</Typography>
                </Flex>
            </Dev>
        </GridItem>
        <GridItem ml={4} display={"flex"} flexDirection={"column"}>
            <Typography variant={TVariant.PresStart15}>Pixels</Typography>
            <Typography variant={TVariant.ComicSans18} mt={1} block>{AppStore.web3.pupperBalance === 0 ? "None 😕" : AppStore.web3.pupperBalance}</Typography>
            <Dev>
                <Flex
                    flexDirection={"column"}
                    borderWidth={"1px"}
                    borderStyle={"solid"}
                    borderColor={colorMode === "light" ? "black" : "white"}
                    alignItems={"center"}
                    pb={2}
                >
                    <Box onClick={async () => AppStore.web3.refreshPupperBalance()} my={2}>
                        🔄
                    </Box>
                    <Typography variant={TVariant.ComicSans10}>Dev tools</Typography>
                </Flex>
            </Dev>
        </GridItem>
    </>}
  </Grid>
})

export default UserMenu