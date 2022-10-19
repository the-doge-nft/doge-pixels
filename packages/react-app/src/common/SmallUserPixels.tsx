import { Box, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import PixelPane from "../DSL/PixelPane/PixelPane";
import { darkModeSecondary, lightModePrimary, lightOrDarkMode } from "../DSL/Theme";
import Tooltip from "../DSL/Tooltip/Tooltip";
import AppStore from "../store/App.store";

interface SmallUserPixelsProps {
  onClick?: (pixelId: number) => void;
  selectedPixelIds?: number[];
}

const SmallUserPixels: React.FC<SmallUserPixelsProps> = observer(({ onClick, selectedPixelIds }) => {
  const { colorMode } = useColorMode();
  return (
    <>
      {AppStore.web3.puppersOwned.map(px => {
        const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(px);
        return (
          <Box
            p={1}
            key={`manage-${px}`}
            bg={
              selectedPixelIds && selectedPixelIds.includes(px)
                ? lightOrDarkMode(colorMode, lightModePrimary, darkModeSecondary)
                : "inherit"
            }
            _hover={{
              bg: lightOrDarkMode(colorMode, lightModePrimary, darkModeSecondary),
            }}
          >
            <Tooltip label={`(${x}, ${y})`}>
              <PixelPane
                // isNew={store.getIsPupperNew(px)}
                size={"xxs"}
                onClick={() => {
                  if (onClick) {
                    onClick(px);
                  }
                }}
                pupper={px}
              />
            </Tooltip>
          </Box>
        );
      })}
    </>
  );
});

export default SmallUserPixels;
