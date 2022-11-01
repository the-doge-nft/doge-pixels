import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import Demo from "../Demo/Demo";
import PixelPreview, { PixelPreviewSize } from "./PixelPreview";

const DemoParkPixels = () => {
  const [selectedPixel, setSelectedPixel] = useState(null);
  return (
    <Demo title={"Park Pixels"}>
      <VStack>
        <PixelPreview
          size={PixelPreviewSize.sm}
          selectedTokenId={selectedPixel}
          previewPixels={[1012396, 1012060, 1212729, 1270578]}
          onPupperClick={pupper => setSelectedPixel(pupper)}
          id={"tester-pixels-0"}
        />
        <PixelPreview
          size={PixelPreviewSize.md}
          selectedTokenId={selectedPixel}
          previewPixels={[1012396, 1012060, 1212729, 1270578]}
          onPupperClick={pupper => setSelectedPixel(pupper)}
          id={"tester-pixels-1"}
        />
        <PixelPreview
          size={PixelPreviewSize.lg}
          selectedTokenId={selectedPixel}
          previewPixels={[1012396, 1012060, 1212729, 1270578]}
          onPupperClick={pupper => setSelectedPixel(pupper)}
          id={"tester-pixels-2"}
        />
      </VStack>
    </Demo>
  );
};

export default DemoParkPixels;
