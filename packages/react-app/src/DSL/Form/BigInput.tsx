import React, {createContext} from "react";
import {Box, Grid, GridItem, useColorMode, VStack} from "@chakra-ui/react";
import NumberInput from "./NumberInput/NumberInput";
import model from "./model";
import {useObserver} from "mobx-react-lite";
import Typography, {TVariant} from "../Typography/Typography";
import Icon from "../Icon/Icon";
import {useFormState} from "react-final-form";
import Button from "../Button/Button";
import {BaseInputValidators} from "./interfaces";
import {lightOrDark} from "../Theme";

interface BigInputProps {
  label?: string;
  store: any;
  storeKey: any;
  validate?: BaseInputValidators;
  renderLeftOfValidation?: () => any
}

export const BigInputContext = createContext({ showEmblem: false, isDisabled: false });

function BigInput<T extends object>({
  label,
  store,
  storeKey,
  validate,
  renderLeftOfValidation
}: BigInputProps) {
  const formState = useFormState()
  const { colorMode } = useColorMode()
  const errors = formState.errors as object
  return useObserver(() => <Box pt={3} pb={4} px={5} borderRadius={9}>
    <VStack spacing={3} align={"flex-start"} w={"full"}>
      <Grid templateColumns={"2fr 1fr 0.75fr 0.5fr"} alignItems={"end"} justifyContent={"center"}>
        <GridItem colSpan={1}>
          <NumberInput
            px={5}
            pl={3}
            pr={2}
            textAlign={"end"}
            color={"yellow.700"}
            textShadow={lightOrDark(colorMode, "6px 6px 0px black", "6px 6px 0px white")}
            border={"none"}
            fontSize={"95px"}
            height={"auto"}
            //@ts-ignore
            sx={{"-webkit-text-stroke": lightOrDark(colorMode, "1px black", "1px white")}}
            showValidation={false}
            validate={validate}
            {...model(store, storeKey)}
          />
        </GridItem>
        {label && <GridItem
          pb={4}
          colSpan={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          mx={4}
        >
          <Typography
            variant={TVariant.PresStart45}
            color={lightOrDark(colorMode, "yellow.50", "purple.700")}
            textShadow={lightOrDark(colorMode, "6px 6px 0px black", "6px 6px 0px white")}
            sx={{"-webkit-text-stroke": lightOrDark(colorMode, "1px black", "1px white")}}
          >
            {label}
          </Typography>
        </GridItem>}
        <GridItem
          pb={8}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          colSpan={1}
        >
          <Button onClick={() => store[storeKey] = Number(store[storeKey]) + 1} mb={2}>
            <Icon icon={"chevron-up"} boxSize={"24px"}/>
          </Button>
          <Button onClick={() => store[storeKey] = Number(store[storeKey]) - 1} mt={2}>
            <Icon icon={"chevron-down"} boxSize={"24px"}/>
          </Button>
        </GridItem>
      </Grid>
      <Grid templateColumns={"1fr 1fr"} w={"full"}>
        <GridItem>
          {renderLeftOfValidation && renderLeftOfValidation()}
        </GridItem>
        <GridItem textAlign={"right"}>
          {Object.entries(errors).length > 0 && <Typography block variant={TVariant.PresStart15} color={"red"}>
            Oops
          </Typography>}
          {Object.entries(errors).map(error => <Typography
            block
            variant={TVariant.ComicSans16}
            color={"red"}>
            {error[1]}
          </Typography>)}
        </GridItem>
      </Grid>
    </VStack>
  </Box>)
}

export default BigInput;
