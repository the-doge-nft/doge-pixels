import React, {createContext} from "react";
import {Box, Grid, GridItem, useColorMode, useMultiStyleConfig, VStack} from "@chakra-ui/react";
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
  const styles = useMultiStyleConfig("BigText", {size: "md"})
  return useObserver(() => <Box pt={3} pb={4} borderRadius={9}>
    <VStack spacing={3} align={"flex-start"} w={"full"}>
      <Grid templateColumns={"2fr 1fr 0.75fr 0.5fr"} alignItems={"end"} justifyContent={"center"}>
        <GridItem colSpan={1}>
          <NumberInput
            px={5}
            pl={3}
            pr={2}
            textAlign={"end"}
            fontSize={"95px"}
            sx={styles.main}
            showValidation={false}
            validate={validate}
            {...model(store, storeKey)}
            showBigInputDrop
            isDisabled
          />
        </GridItem>
        {label && <GridItem
          pb={4}
          colSpan={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          position={"relative"}
          mx={4}
          zIndex={1}
        >
          <Typography variant={TVariant.PresStart45} sx={styles.label}>
            {label}
          </Typography>
          <Typography variant={TVariant.PresStart45} sx={styles.drop}>
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
            variant={TVariant.ComicSans18}
            color={"red"}>
            {error[1]}
          </Typography>)}
        </GridItem>
      </Grid>
    </VStack>
  </Box>)
}

export default BigInput;
