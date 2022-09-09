import ParkPixels from "../../pages/DogPark/ParkPixels";
import {observer} from "mobx-react-lite";
import {Box, Flex} from "@chakra-ui/react";
import Button from "../../DSL/Button/Button";
import shareToTwitter from "../../helpers/shareToTwitter";
import {PixelOwnerInfo} from "../../pages/DogPark/DogParkPage.store";
import {useState} from "react";

const SharePixelsDialog = observer(({action, pixelOwner}: {action: 'mint' | 'burn', pixelOwner: PixelOwnerInfo}) => {

    const id = 'share-pixels-canvas'

    // @next sync with PixelArt functionality
    const postTweet = () => {
        const canvas: HTMLCanvasElement = document.getElementById(id) as HTMLCanvasElement;
        const data = canvas.toDataURL().replace("data:image/png;base64,", "");
        shareToTwitter(data, `I just ${action === 'mint' ? 'minted' : 'burned'} Doge Pixels. Check them out here.`)
    }

    const [selectedPixel, setSelectedPixel] = useState(-1)

    return <Flex justifyContent={"center"}>
        <Box>
            <ParkPixels
                id={id}
                selectedPixel={selectedPixel}
                pixelOwner={pixelOwner}
                onPupperClick={(pupper) => {
                    if (pupper === null) {
                        setSelectedPixel(-1)
                    } else {
                        setSelectedPixel(pupper)
                    }
                }}
            />
            {/*<Flex justifyContent={"center"} my={4}>*/}
            {/*    <Button onClick={postTweet}>Share</Button>*/}
            {/*</Flex>*/}
        </Box>
    </Flex>
})

export default SharePixelsDialog
