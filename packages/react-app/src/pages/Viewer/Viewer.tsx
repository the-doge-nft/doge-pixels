import React, { Suspense, useMemo } from "react";
import { Box, Flex, Grid, GridItem, useColorMode } from "@chakra-ui/react";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import Button from "../../DSL/Button/Button";
import ThreeScene from "./ThreeScene";
import ViewerStore from "./Viewer.store";
import Modal from "../../DSL/Modal/Modal";
import { observer } from "mobx-react-lite";
import Form from "../../DSL/Form/Form";
import NumberInput from "../../DSL/Form/NumberInput/NumberInput";
import Submit from "../../DSL/Form/Submit";
import { required } from "../../DSL/Form/validation";

const Viewer = observer(() => {
  const { colorMode } = useColorMode();
  const store = useMemo(() => new ViewerStore(), []);
  return (
    <>
      <Grid templateColumns={"2fr 1fr"} flexGrow={1}>
        <GridItem border={"solid 4px"} borderColor={colorMode === "light" ? "black" : "white"} mr={2}>
          <Suspense fallback={"Loading Kobosu..."}>
            <ThreeScene />
          </Suspense>
        </GridItem>
        <GridItem border={"solid 4px"} borderColor={colorMode === "light" ? "black" : "white"} ml={2}>
          <Flex p={3} color={"black"} flexDirection={"column"} justifyContent={"space-between"} h={"100%"}>
            <Box>
              <Typography variant={TVariant.Title22} mb={1} block>
                Own the Doge
              </Typography>
              <Typography variant={TVariant.Body16} block>
                The original image of Kabosu was minted as an NFT on ____ & aquired by pleasrDAO on ______ for ___ ETH.
                On ____ pleasrDAO fractionalized the image of the worlds most famous dog, allowing us to own a portion
                of the original meme. Through the use of fractional.art $DOG (an ERC-20) was was introduced. We took it
                one step further & are allowing you to swap your $DOG for an actual pixel. That right. If you want to
                actually own a pixel of the original DOGE, hit mint now.
              </Typography>
            </Box>
            <Button size={"lg"} onClick={() => (store.isMintModalOpen = true)}>
              Mint Pixels
            </Button>
          </Flex>
        </GridItem>
      </Grid>
      {store.isMintModalOpen && (
        <Modal
          size={"xl"}
          isOpen={store.isMintModalOpen}
          onClose={() => (store.isMintModalOpen = false)}
          renderHeader={() => <Typography variant={TVariant.Title22}>Mint Pixels</Typography>}
        >
          <Box>
            <Typography variant={TVariant.Body14} color={"gray.300"}>
              Trade your $DOG for pixels. "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </Typography>
          </Box>
          <Form
            onSubmit={async (data, form) => {
              console.log("debug::formdata", data);
            }}
          >
            <Grid templateColumns={"repeat(3, 1fr)"} templateRows={"repeat(3, 1fr)"}>
              <GridItem colSpan={1}>
                <NumberInput name={"dog_tokens"} label={"Send"} validate={required} showValidation={false} w={"100%"} />
              </GridItem>
              <GridItem colSpan={1}></GridItem>
              <GridItem colSpan={1}></GridItem>

              <GridItem colSpan={3} my={3}>
                <NumberInput name={"test"} validate={required} showValidation={false} />
              </GridItem>

              <GridItem colSpan={1}></GridItem>
              <GridItem colSpan={1}></GridItem>
              <GridItem colSpan={1}>
                <NumberInput name={"dog_pixels"} label={"Receive"} validate={required} showValidation={false} />
              </GridItem>
            </Grid>
            <Submit label={"Mint"} w={"100%"} size={"md"} mt={10} />
          </Form>
        </Modal>
      )}
    </>
  );
});

export default Viewer;
