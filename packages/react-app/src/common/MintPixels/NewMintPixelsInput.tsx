import { observer } from "mobx-react-lite";
import { Box, Flex, HStack, Spinner, useColorMode, VStack } from "@chakra-ui/react";
import Pane from "../../DSL/Pane/Pane";
import Icon from "../../DSL/Icon/Icon";
import React, { useState } from "react";
import MintPixelsDialogStore from "./MintPixelsDialog.store";
import BigText from "../../DSL/BigText/BigText";
import Select from "../../DSL/Select/Select";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import Button, { ButtonVariant } from "../../DSL/Button/Button";
import { lightOrDarkMode } from "../../DSL/Theme";

const NewMintPixelsInput: React.FC<{ store: MintPixelsDialogStore }> = observer(({ store }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { colorMode } = useColorMode();
  return (
    <Box>
      <Pane px={4} py={2}>
        <HStack spacing={4}>
          <Box overflow={"hidden"} flex={2}>
            {store.recentQuote?.srcCurrencyTotal && (
              <BigText size={"sm"}>{formatWithThousandsSeparators(store.recentQuote.srcCurrencyTotal)}</BigText>
            )}
          </Box>
          <VStack spacing={3} flex={1} alignItems={"flex-end"} px={1}>
            <Select
              items={store.srcCurrencySelectItems}
              value={store.srcCurrency}
              onChange={val => {
                store.srcCurrency = val;
              }}
            />
            {store.srcCurrencyBalance.humanReadable !== null && (
              <Flex flexDirection={"column"} alignItems={"flex-end"}>
                <Typography
                  color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}
                  variant={TVariant.ComicSans14}
                  fontWeight={"bold"}
                >
                  {formatWithThousandsSeparators(store.srcCurrencyBalance.humanReadable)}
                </Typography>
                <Typography color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")} variant={TVariant.ComicSans14}>
                  balance
                </Typography>
              </Flex>
            )}
          </VStack>
        </HStack>
      </Pane>
      <Flex justifyContent={"center"} mt={6} mb={2}>
        <Icon icon={"chevron-down"} boxSize={7} />
      </Flex>
      <HStack spacing={12}>
        <VStack>
          <Button
            onClick={() => store.incrementPixelCount()}
            mb={2}
            isDisabled={
              store.pixelCount === store.recentQuote?.maxPixelAmount || store.recentQuote?.maxPixelAmount === 0
            }
          >
            <Icon icon={"chevron-up"} boxSize={5} />
          </Button>
          <Button onClick={() => store.decrementPixelCount()} mt={2} isDisabled={store.pixelCount <= 1}>
            <Icon icon={"chevron-down"} boxSize={5} />
          </Button>
        </VStack>
        <Pane px={4} py={2} display={"flex"} w={"full"}>
          <BigText size={"md"}>{store.pixelCount}</BigText>
          <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
            <BigText isLight size={"sm"}>
              {store.pixelCount === 1 ? "PIXEL" : "PIXELS"}
            </BigText>
            {store.recentQuote && (
              <Button
                mt={1}
                p={0}
                variant={ButtonVariant.Text}
                isDisabled={
                  store.pixelCount === store.recentQuote!.maxPixelAmount || store.recentQuote.maxPixelAmount === 0
                }
                size={"xs"}
                onClick={() => (store.pixelCount = store.recentQuote!.maxPixelAmount)}
              >
                Set Max ({store.recentQuote?.maxPixelAmount})
              </Button>
            )}
          </Flex>
        </Pane>
      </HStack>
      <Pane px={4} py={2} mt={8}>
        {store.isLoading && (
          <HStack spacing={2}>
            <Spinner size={"sm"} color={colorMode === "light" ? "yellow.800" : "purple.50"} />
            <Typography
              variant={TVariant.ComicSans14}
              color={colorMode === "light" ? "yellow.800" : "purple.50"}
              fontWeight={"medium"}
            >
              Fetching best price
            </Typography>
          </HStack>
        )}
        {!store.isLoading && store.recentQuote && store.pixelCount && (
          <Box>
            <HStack
              justifyContent={"space-between"}
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              cursor={"pointer"}
            >
              <Typography variant={TVariant.PresStart10}>
                1 Pixel = {formatWithThousandsSeparators(store.recentQuote.srcCurrencyTotal / Number(store.pixelCount))}{" "}
                {store.recentQuote?.srcCurrency}
              </Typography>
              <Icon icon={isDetailsOpen ? "chevron-down" : "chevron-up"} boxSize={6} />
            </HStack>
            {isDetailsOpen && store.recentQuote && (
              <Box mt={2}>
                <Flex justifyContent={"space-between"}>
                  {store.srcCurrency !== "DOG" && (
                    <>
                      <Typography variant={TVariant.ComicSans14}>
                        {formatWithThousandsSeparators(store.recentQuote.srcCurrencyTotal)}{" "}
                        {store.recentQuote.srcCurrency}
                      </Typography>
                      <Typography variant={TVariant.ComicSans14}>=</Typography>
                    </>
                  )}
                  <Typography variant={TVariant.ComicSans14}>
                    {formatWithThousandsSeparators(store.recentQuote.dogAmount)} DOG
                  </Typography>
                  <Typography variant={TVariant.ComicSans14}>=</Typography>
                  <Typography variant={TVariant.ComicSans14}>
                    {store.pixelCount} {store.pixelCount === 1 ? "Pixel" : "Pixels"}
                  </Typography>
                </Flex>
                {store.srcCurrency !== "DOG" && (
                  <>
                    <Box mt={4}>
                      <Flex justifyContent={"space-between"}>
                        <Typography variant={TVariant.ComicSans14}>Price</Typography>
                        <Typography variant={TVariant.ComicSans14}>
                          {formatWithThousandsSeparators(store.recentQuote.srcCurrencyAmount)} {store.srcCurrency}
                        </Typography>
                      </Flex>
                      <Flex justifyContent={"space-between"}>
                        <Typography variant={TVariant.ComicSans14}>Fees (incl. gas costs)</Typography>
                        <Typography variant={TVariant.ComicSans14}>
                          {formatWithThousandsSeparators(store.recentQuote.srcCurrencyFee)} {store.srcCurrency}
                        </Typography>
                      </Flex>
                    </Box>
                    <Flex
                      color={colorMode === "light" ? "yellow.800" : "purple.50"}
                      alignItems={"center"}
                      justifyContent={"flex-end"}
                      mt={3}
                    >
                      <Icon icon={"cowswap"} boxSize={6} mr={1} />
                      <Typography variant={TVariant.ComicSans14}>Powered by CoW Protocol</Typography>
                    </Flex>
                  </>
                )}
              </Box>
            )}
          </Box>
        )}
      </Pane>
    </Box>
  );
});

export default NewMintPixelsInput;
