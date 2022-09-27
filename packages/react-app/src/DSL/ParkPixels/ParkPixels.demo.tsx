import React, {useState} from "react";
import Demo from "../Demo/Demo";
import ParkPixels, {PixelPreviewSize} from "./ParkPixels";
import {Flex, HStack, VStack} from "@chakra-ui/react";

const DemoParkPixels = () => {
    const [selectedPixel, setSelectedPixel] = useState(null)
    return <Demo title={"Park Pixels"}>
        <VStack>
            <ParkPixels
                size={PixelPreviewSize.sm}
                selectedPixel={selectedPixel}
                previewPixels={[1012396, 1012060, 1212729, 1270578]}
                onPupperClick={(pupper) => setSelectedPixel(pupper)}
                id={'tester-pixels-0'}
            />
            <ParkPixels
                size={PixelPreviewSize.md}
                selectedPixel={selectedPixel}
                previewPixels={[1012396, 1012060, 1212729, 1270578]}
                onPupperClick={(pupper) => setSelectedPixel(pupper)}
                id={'tester-pixels-1'}
            />
            <ParkPixels
                size={PixelPreviewSize.lg}
                selectedPixel={selectedPixel}
                previewPixels={[1012396, 1012060, 1212729, 1270578]}
                onPupperClick={(pupper) => setSelectedPixel(pupper)}
                id={'tester-pixels-2'}
            />
        </VStack>
    </Demo>
}

export default DemoParkPixels
