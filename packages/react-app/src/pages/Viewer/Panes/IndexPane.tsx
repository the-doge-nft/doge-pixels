import ViewerStore, {ViewerView} from "../Viewer.store";
import {Box, Flex} from "@chakra-ui/react";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import Button, {ButtonVariant} from "../../../DSL/Button/Button";
import AppStore from "../../../store/App.store";
import React from "react";
import {observer} from "mobx-react-lite";

const IndexPane = observer(function IndexPane({store}: {store: ViewerStore}) {
  return  <>
    <Flex flexDirection={"column"} flexGrow={0} h={"100%"}>
      <Typography variant={TVariant.ComicSans22} mb={1} block>
        Own the Doge
      </Typography>

      <Box overflow={"scroll"} flexGrow={1} h={"full"}>
        <Box maxHeight={"300px"}>
          <Typography variant={TVariant.ComicSans16} block>
            Look. Closer. Closer! Can you see it? A piece of the pupper picture for your pocket. A colored square with your name on it. A portal to the new paradigm of digital doge ownership.
          </Typography>
          <Typography variant={TVariant.ComicSans16} mt={4} block>
            Kabosu doesn’t speak much Japanese, let alone English. But I imagine if she could see you now she’d say something like
          </Typography>
          <Typography variant={TVariant.ComicSans16} mt={4} block>
            w o w - look how far we’ve come?
          </Typography>
          <Typography variant={TVariant.ComicSans16} mt={4} block>
            In a sea of dog coins where fortunes are lost and millionaires are minted, one thing remains constant: $DOG is backed. 55,240 DOG = 1 Pixel = 55,240 DOG. Lock DOG to mint pixels, or burn pixels to redeem their fair value in DOG.
          </Typography>
          <Typography variant={TVariant.ComicSans16} mt={4} block>
            If you are reading this, you are early. A minted pixel is a bet on the future, a step in the forward direction, a leap of faith. But chaos begets order. And while there are no guarantees, it's likely that early participants in this journey will be handsomely rewarded down the road.
          </Typography>
          <Typography variant={TVariant.ComicSans16} mt={4} block>
            We’ve said too much. Mint today and become a bleeding edge innovator in fractionalized NFT ownership. Mint today and choose hope over fear.
          </Typography>
        </Box>
      </Box>
    </Flex>

    <Flex direction={"column"} alignItems={"center"} mt={5} mb={3} flexGrow={0}>
      {AppStore.web3.web3Provider && <Flex mb={6}>
        <Button mr={3} width={"fit-content"} onClick={() => (store.isMintModalOpen = true)}>
          Mint
        </Button>
        <Button ml={3} width={"fit-content"} onClick={() => (store.isBurnModalOpen = true)}>
          Burn
        </Button>
      </Flex>}
      {AppStore.web3.tokenIdsOwned.length > 0 && <Button
          width={"fit-content"}
          display={"block"}
          variant={ButtonVariant.Text}
          size={"sm"}
          onClick={() => store.pushNavigation(ViewerView.Manage)}>
          My Pixels
      </Button>}
    </Flex>
  </>
})

export default IndexPane;