import React, {useCallback, useEffect, useState} from "react";
import BigInput from "../../DSL/Form/BigInput";
import {maxValue, minValue, required} from "../../DSL/Form/validation";
import {Box, Spinner} from "@chakra-ui/react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import Select from "../../DSL/Select/Select";
import {formatWithThousandsSeparators} from "../../helpers/numberFormatter";
import MintPixelsDialogStore from "./MintPixelsDialog.store";
import Button, {ButtonVariant} from "../../DSL/Button/Button";

export const MintPixelsInput: React.FC<{ store: MintPixelsDialogStore }> = ({store}) => {
    const [showLabel, setShowLabel] = useState(true)

    useEffect(() => {
        if (Number(store.pixelCount) >= 100) {
            setShowLabel(false)
        } else if (Number(store.pixelCount && !showLabel) < 100) {
            setShowLabel(true)
        }
    }, [store.pixelCount])

    const PixelInput = useCallback(() => {
        return <BigInput
            store={store}
            storeKey={"pixelCount"}
            label={showLabel ? "PX" : undefined}
            validate={[
                required("1 pixel minimum"),
                minValue(1, "Must mint at least 1 pixel"),
                maxValue(store.recentQuote?.maxPixelAmount, `Not enough ${store.srcCurrency}`)
            ]}
            renderLeftOfValidation={() => {
                return <Box>
                    <Box>
                        <Typography variant={TVariant.PresStart12}>Mint for currency</Typography>
                        <Box mt={1}>
                            <Select
                                items={store.srcCurrencySelectItems}
                                value={store.srcCurrency}
                                onChange={(val) => {
                                    store.srcCurrency = val
                                }}/>
                        </Box>
                    </Box>
                    {store.recentQuote && !store.isLoading && <Box mt={4} display={"flex"} flexDirection={"column"}>
                      <Typography variant={TVariant.ComicSans14}>
                          {store.recentQuote.computedPixelCount} Pixel{store.pixelCount === 1 ? '' : 's'} = {formatWithThousandsSeparators(store.recentQuote.srcCurrencyTotal)} {store.recentQuote.srcCurrency}
                      </Typography>
                      <Typography variant={TVariant.ComicSans14} mt={3}>
                        Max you can mint: {store.recentQuote.maxPixelAmount}
                      </Typography>
                      <Typography variant={TVariant.ComicSans12}>
                        Your balance: {store.srcCurrencyBalance} {store.srcCurrency}
                      </Typography>
                        {store.recentQuote.maxPixelAmount > 0 &&
                      <Button variant={ButtonVariant.Text}
                              isDisabled={store.pixelCount === store.recentQuote!.maxPixelAmount}
                              size={"sm"}
                              onClick={() => store.pixelCount = store.recentQuote!.maxPixelAmount}>
                        Set Max ({store.recentQuote.maxPixelAmount})
                      </Button>}
                    </Box>}
                </Box>
            }}
        />
    }, [showLabel, store, store.recentQuote?.maxPixelAmount, store.srcCurrency, store.srcCurrencySelectItems, store.isLoading, store.recentQuote])
    return <PixelInput/>
}
