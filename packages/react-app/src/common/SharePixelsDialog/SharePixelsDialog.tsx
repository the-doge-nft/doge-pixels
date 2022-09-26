import ParkPixels from "../../pages/DogPark/ParkPixels";
import {observer} from "mobx-react-lite";
import {Box, Flex} from "@chakra-ui/react";
import Button from "../../DSL/Button/Button";
import shareToTwitter, {TwitterShareType} from "../../helpers/shareToTwitter";
import {PixelOwnerInfo} from "../../pages/DogPark/DogParkPage.store";
import {useState} from "react";

const SharePixelsDialog = observer(({action, previewPixels}: {action: 'mint' | 'burn', previewPixels: number[]}) => {

    const id = 'share-pixels-canvas'

    // @next sync with PixelArt functionality
    const postTweet = () => {
        let description = "I just minted Doge Pixels. Check them out here."
        if (action === "burn") {
            description = "I just burned Doge Pixels. See which ones I let go here."
        }

        const canvas: HTMLCanvasElement = document.getElementById(id) as HTMLCanvasElement;
        const data = canvas.toDataURL().replace("data:image/png;base64,", "");
        shareToTwitter(data, description, action === "mint" ? TwitterShareType.Mint : TwitterShareType.Burn)
    }

    const [selectedPixel, setSelectedPixel] = useState(-1)

    return <Flex justifyContent={"center"}>
        <Box>
            <ParkPixels
                id={id}
                selectedPixel={selectedPixel}
                previewPixels={previewPixels}
                onPupperClick={(pupper) => {
                    if (pupper === null) {
                        setSelectedPixel(-1)
                    } else {
                        setSelectedPixel(pupper)
                    }
                }}
            />
            <Flex justifyContent={"center"} mt={6} mb={7}>
                <Button onClick={postTweet}>Share</Button>
            </Flex>
        </Box>
    </Flex>
})

export default SharePixelsDialog
