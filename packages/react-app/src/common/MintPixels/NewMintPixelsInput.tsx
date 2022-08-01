import {observer} from "mobx-react-lite";
import {Box, Flex, HStack, VStack} from "@chakra-ui/react";
import Pane from "../../DSL/Pane/Pane";
import Icon from "../../DSL/Icon/Icon";
import React from "react";
import MintPixelsDialogStore from "./MintPixelsDialog.store";
import BigText from "../../DSL/BigText/BigText";
import Select from "../../DSL/Select/Select";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import {formatWithThousandsSeparators} from "../../helpers/numberFormatter";
import Button, {ButtonVariant} from "../../DSL/Button/Button";

const NewMintPixelsInput: React.FC<{ store: MintPixelsDialogStore }> = observer(({store}) => {
    return <Box>
        <Pane p={4}>
            <HStack spacing={4}>
                <Box overflow={'hidden'} flex={2}>
                    {store.recentQuote?.srcCurrencyTotal &&
                    <BigText size={"sm"}>{formatWithThousandsSeparators(store.recentQuote.srcCurrencyTotal)}</BigText>}
                </Box>
                <VStack spacing={2} flex={1} alignItems={'flex-start'}>
                    <Select
                        items={store.srcCurrencySelectItems}
                        value={store.srcCurrency}
                        onChange={(val) => {
                            store.srcCurrency = val
                        }}/>
                    {store.srcCurrencyBalance !== null && <Box>
                        <Typography color={'yellow.800'} variant={TVariant.ComicSans14}>
                            Balance: {formatWithThousandsSeparators(store.srcCurrencyBalance)}
                        </Typography>
                    </Box>}
                </VStack>
            </HStack>
        </Pane>
        <Flex justifyContent={"center"} mt={6}>
            <Icon
                icon={"chevron-down"}
                boxSize={7}/>
        </Flex>
        <HStack spacing={6}>
            <VStack>
                <Button
                    onClick={() => store.incrementPixelCount()}
                    mb={2}
                    isDisabled={store.pixelCount === store.recentQuote?.maxPixelAmount}
                >
                    <Icon
                        icon={"chevron-up"}
                        boxSize={7}/>
                </Button>
                <Button
                    onClick={() => store.decrementPixelCount()}
                    mt={2}
                    isDisabled={store.pixelCount === 0}
                >
                    <Icon
                        icon={"chevron-down"}
                        boxSize={7}/>
                </Button>
            </VStack>
            <Pane p={4}>
                <HStack>
                    <BigText size={"md"}>{store.pixelCount}</BigText>
                    <VStack>
                        <BigText size={"md"}>PIXELS</BigText>
                        {store.recentQuote && <Button p={0} variant={ButtonVariant.Text}
                                isDisabled={store.pixelCount === store.recentQuote!.maxPixelAmount}
                                size={"xs"}
                                onClick={() => store.pixelCount = store.recentQuote!.maxPixelAmount}>
                            Set Max ({store.recentQuote?.maxPixelAmount})
                        </Button>}
                    </VStack>
                </HStack>
            </Pane>
        </HStack>
    </Box>
})

export default NewMintPixelsInput
