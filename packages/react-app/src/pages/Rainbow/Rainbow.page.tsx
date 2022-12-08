import { Box, Flex, Image } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { NamedRoutes, route, SELECTED_PIXEL_PARAM } from "../../App.routes";
import Button, { ConnectWalletButton } from "../../DSL/Button/Button";
import { Type } from "../../DSL/Fonts/Fonts";
import Link from "../../DSL/Link/Link";
import PixelPreview from "../../DSL/PixelPreview/PixelPreview";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import jsonify from "../../helpers/jsonify";
import RainbowLogo from "../../images/rainbow-logo.png";
import RainbowSponge from "../../images/rainbow-sponge.jpg";
import { targetChain } from "../../services/wagmi";
import AppStore from "../../store/App.store";
import RainbowStore from "./Rainbow.store";
import RainbowClaimDrawer from "./RainbowClaimDrawer";
import RainbowClaimModal from "./RainbowClaimModal";

const RainbowPage = observer(function RainbowPage() {
  const store = useMemo(() => new RainbowStore(), []);
  useEffect(() => {
    store.init();
    return () => {
      store.destroy();
    };
  }, [store]);
  return (
    <>
      <Flex flexDir={"column"} w={"full"} alignItems={"center"} mt={10} pt={22}>
        <Box maxW={"xl"} flexGrow={1}>
          <Typography block textAlign={"center"} variant={TVariant.ComicSans28} mt={4} fontWeight={"bold"}>
            Henlo swapper 🐶!
          </Typography>
          <Typography block textAlign={"center"} variant={TVariant.ComicSans20} mt={4}>
            If you swapped at least 16,969 $DOG using Rainbow on Ethereum mainnet, Polygon, or Arbitrum between November
            2nd and December 6, congratulations!
          </Typography>
          <Typography block textAlign={"center"} variant={TVariant.ComicSans20} mt={4}>
            You are eligible to get a FREE Pixel and have contributed in the form of swap fees (0.85%) for our{" "}
            <Link
              fontSize={"20px"}
              size={"lg"}
              variant={Type.ComicSans}
              isExternal
              to={"https://twitter.com/hashtag/BronzeTheDoge?src=hashtag_click"}
            >
              #BronzeTheDoge
            </Link>{" "}
            initiative 🎉.
          </Typography>
          <Typography block textAlign={"center"} variant={TVariant.ComicSans20} mt={4}>
            Much thanks to PleasrDAO for sponsoring this 220 Pixel prize pool and the Rainbow team for making this
            possible! Rainbow is indeed for Doges 🌈 x 🐶 = wow. Make sure you are logged in with the wallet you used
            for swapping $DOG. Click below to claim👇
          </Typography>
          <Flex justifyContent={"center"} mt={6}>
            {!store.isConnected && <ConnectWalletButton />}
            {AppStore.web3?.network?.id === targetChain.id && (
              <>
                {store.isConnected && !store.isInWhitelist && store.pixelIdsInContract.length > 0 && (
                  <Typography mt={6} variant={TVariant.ComicSans22} fontWeight={"bold"}>
                    Not in whitelist 🙁
                  </Typography>
                )}
                {store.showClaimButton && (
                  <Button
                    mt={10}
                    onClick={() => {
                      if (AppStore.rwd.isMobile) {
                        store.showDrawer = true;
                      } else {
                        store.showModal = true;
                      }
                    }}
                  >
                    Claim
                  </Button>
                )}
                {store.hasUserClaimed && (
                  <Box mt={10} mb={16}>
                    {!store.pixelIdClaimed && (
                      <Image
                        src={RainbowSponge}
                        alt={"ty4claiming"}
                        borderWidth={"1px"}
                        borderColor={"black"}
                        borderStyle={"solid"}
                        maxW={"sm"}
                      />
                    )}
                    {store.pixelIdClaimed && (
                      <Flex flexDir={"column"} gap={4} alignItems={"center"}>
                        <PixelPreview
                          id={"rainbow-claim-preview"}
                          onPupperClick={() => console.log()}
                          selectedTokenId={store.pixelIdClaimed}
                          previewPixels={[store.pixelIdClaimed]}
                        />
                        <Link
                          display={"inline-block"}
                          isNav
                          to={route(NamedRoutes.PIXELS, { [SELECTED_PIXEL_PARAM]: store.pixelIdClaimed })}
                        >
                          <Button onClick={() => {}}>View in Portal</Button>
                        </Link>
                      </Flex>
                    )}
                    <Typography
                      fontWeight={"bold"}
                      mt={10}
                      block
                      textAlign={"center"}
                      variant={TVariant.ComicSans20}
                      w={"full"}
                    >
                      Thanks for claiming!
                    </Typography>
                  </Box>
                )}
                {!store.hasUserClaimed && store.pixelIdsInContract.length === 0 && (
                  <Typography mt={4} color={"yellow.100"} fontWeight={"bold"} variant={TVariant.ComicSans22}>
                    No pixels left!
                  </Typography>
                )}
              </>
            )}
          </Flex>
          {store.showAdminTools && (
            <Flex
              flexDir={"column"}
              alignItems={"center"}
              mt={10}
              borderStyle={"dashed"}
              borderWidth={"1px"}
              borderColor={"black"}
              justifyContent={"center"}
              px={4}
              py={6}
            >
              {store.isRainbowContractApprovedToSpendPixels && (
                <>
                  {store.userHasPixels && (
                    <Button isLoading={store.isDepositing} onClick={() => store.depositPixels()}>
                      Deposit all pixels
                    </Button>
                  )}
                  {!store.userHasPixels && (
                    <Typography variant={TVariant.ComicSans16}>
                      No pixels found -- please mint some to deposit
                    </Typography>
                  )}
                  {store.pixelIdsInContract.length > 0 && (
                    <Flex justifyContent={"center"} w={"full"} mt={6} flexWrap={"wrap"}>
                      <Typography maxW={"full"} textAlign={"center"} variant={TVariant.ComicSans16}>
                        {jsonify(store.pixelIdsInContract)}
                      </Typography>
                      <Button my={4} isLoading={store.isWithdrawLoading} onClick={() => store.withdraw()}>
                        Withdraw
                      </Button>
                    </Flex>
                  )}
                </>
              )}
              {!store.isRainbowContractApprovedToSpendPixels && (
                <Button isLoading={store.isApproving} onClick={() => store.approveRainbowPixelSpend()}>
                  Approve rainbow contract to spend pixels
                </Button>
              )}
            </Flex>
          )}
        </Box>
        <Flex flexDir={"column"} gap={4}>
          <Flex justifyContent={"center"} mt={6}>
            <Typography color={"yellow.100"} variant={TVariant.ComicSans16}>
              {store.pixelsRemaining}/220 pixels left
            </Typography>
          </Flex>
          <Flex alignItems={"center"} gap={4}>
            <Typography variant={TVariant.ComicSans18} fontWeight={"bold"}>
              The Doge NFT
            </Typography>
            <Typography variant={TVariant.ComicSans22}>🤝</Typography>
            <Image src={RainbowLogo} alt={"Rainbow logo"} maxW={"120px"} />
          </Flex>
        </Flex>
      </Flex>
      {store.showModal && (
        <RainbowClaimModal
          onClose={() => (store.showModal = false)}
          isOpen={store.showModal}
          rainbowContract={store.rainbowContract}
          onSuccess={() => store.onSuccess()}
        />
      )}
      {store.showDrawer && (
        <RainbowClaimDrawer
          rainbowContract={store.rainbowContract}
          onClose={() => (store.showDrawer = false)}
          isOpen={store.showDrawer}
          onSuccess={() => store.onSuccess()}
        />
      )}
    </>
  );
});

export default RainbowPage;
