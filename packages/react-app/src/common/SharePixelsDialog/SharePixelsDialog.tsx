import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import Button from "../../DSL/Button/Button";
import PixelPreview from "../../DSL/PixelPreview/PixelPreview";
import shareToTwitter, { TwitterShareType } from "../../helpers/shareToTwitter";

const SharePixelsDialog = observer(
  ({ action, previewPixels }: { action: "mint" | "burn" | "claimed"; previewPixels: number[] }) => {
    const id = "share-pixels-canvas";

    // @next sync with PixelArt functionality
    const postTweet = () => {
      let description = "I just minted Doge Pixels. Check them out here.";
      if (action === "burn") {
        description = "I just burned Doge Pixels. See which ones I let go here.";
      } else if (action === "claimed") {
        if (previewPixels.length === 1) {
          description = "I just claimed a Doge Pixel.";
        } else {
          description = "I just claimed Doge Pixels.";
        }
      }

      let type = TwitterShareType.Mint;
      if (action === "burn") {
        type = TwitterShareType.Burn;
      } else if (action === "claimed") {
        type = TwitterShareType.Claim;
      }

      const canvas: HTMLCanvasElement = document.getElementById(id) as HTMLCanvasElement;
      const data = canvas.toDataURL().replace("data:image/png;base64,", "");
      shareToTwitter(data, description, type);
    };

    const [selectedPixel, setSelectedPixel] = useState(null);

    return (
      <Flex justifyContent={"center"}>
        <Box>
          <PixelPreview
            id={id}
            selectedTokenId={selectedPixel}
            previewPixels={previewPixels}
            onPupperClick={setSelectedPixel}
          />
          <Flex justifyContent={"center"} mt={6} mb={7}>
            <Button onClick={postTweet}>Share</Button>
          </Flex>
        </Box>
      </Flex>
    );
  },
);

export default SharePixelsDialog;
