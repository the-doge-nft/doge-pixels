import React, { createContext, useContext } from "react";
import { Box, Circle, Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import NumberInput, { NumberInputProps } from "./NumberInput/NumberInput";
import model from "./model";
import SelectInput, { SelectInputProps } from "./SelectInput";
import { useObserver } from "mobx-react-lite";
import Typography, { TVariant } from "../Typography/Typography";
import Icon, { IconName } from "../Icon/Icon";
import { IconType } from "react-icons";
import { useFormState } from "react-final-form";
import { ObjectKeys } from "../../helpers/objects";

interface BigInputProps {
  label: string;
  renderNumberInput: () => JSX.Element;
  renderSelectInput: () => JSX.Element;
  renderNextToError?: () => JSX.Element;
  renderDefaultEmblem?: () => JSX.Element;
  renderValidEmblem?: () => JSX.Element;
  showEmblem?: boolean;
  isDisabled?: boolean;
}

export const BigInputContext = createContext({ showEmblem: false, isDisabled: false });

function BigInput<T extends object>({
  label,
  renderNumberInput,
  renderSelectInput,
  renderNextToError,
  renderDefaultEmblem,
  renderValidEmblem,
  showEmblem = true,
  isDisabled = false,
}: BigInputProps) {
  const formState = useFormState();
  return (
    <BigInputContext.Provider value={{ showEmblem, isDisabled }}>
      <Box bg={isDisabled ? "gray.100" : "gray.50"} pt={3} pb={4} px={5} borderRadius={9}>
        <VStack spacing={3} align={"flex-start"}>
          <Box>
            <Typography variant={TVariant.Body16} color={"gray.500"}>
              {label}
            </Typography>
          </Box>
          <Grid templateColumns={"2fr 1fr"} gap={1}>
            <GridItem>{renderNumberInput()}</GridItem>
            <GridItem>{renderSelectInput()}</GridItem>
          </Grid>
        </VStack>
      </Box>
      <Grid templateColumns={"1fr 1fr"}>
        <GridItem>
          {showEmblem &&
            (() => {
              const hasBeenModified = ObjectKeys(formState.modified).some(key => formState.modified?.[key]);
              if (hasBeenModified) {
                if (ObjectKeys(formState.errors).length > 0) {
                  return (
                    <BigInputEmblem icon={"close"} isError>
                      {formState.errors?.[ObjectKeys(formState.errors)[0]]}
                    </BigInputEmblem>
                  );
                } else {
                  return renderValidEmblem ? renderValidEmblem() : <></>;
                }
              } else {
                return renderDefaultEmblem ? renderDefaultEmblem() : <></>;
              }
            })()}
        </GridItem>
        <GridItem w={"100%"} h={"100%"}>
          {renderNextToError && renderNextToError()}
        </GridItem>
      </Grid>
    </BigInputContext.Provider>
  );
}

interface BigInputNumberProps<T> extends Omit<NumberInputProps, "name" | "isDisabled"> {
  store: T;
  storeKey: keyof T;
}

function BigInputNumber<T extends object>({ store, storeKey, ...rest }: BigInputNumberProps<T>) {
  const { showEmblem, isDisabled } = useContext(BigInputContext);
  return useObserver(() => {
    return (
      <NumberInput
        {...rest}
        {...model(store, storeKey)}
        p={0}
        fontSize={"38"}
        height={"auto"}
        showValidation={!showEmblem}
        isDisabled={isDisabled}
      />
    );
  });
}

interface BigInputSelectProps<T> extends Omit<SelectInputProps, "name" | "isDisabled"> {
  store: T;
  storeKey: keyof T;
}

function BigInputSelect<T extends object>({ store, storeKey, items, ...rest }: BigInputSelectProps<T>) {
  const { showEmblem, isDisabled } = useContext(BigInputContext);
  return useObserver(() => (
    <SelectInput {...rest} {...model(store, storeKey)} variant={"outline"} items={items} isDisabled={isDisabled} />
  ));
}

interface BigInputEmblem {
  icon: IconName;
  isError?: boolean;
  children?: any;
}

function BigInputEmblem({ icon, isError = false, children }: BigInputEmblem) {
  return (
    <>
      <Box width={"5px"} height={"65px"} bg={"gray.50"} ml={10} />
      <Flex alignItems={"flex-start"} pl={5} overflow={"auto"}>
        <Circle
          bg={"gray.50"}
          size={"45px"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          color={isError ? "red.500" : "gray.500"}
        >
          <Icon icon={icon} w={"25px"} h={"25px"} />
        </Circle>
        <Typography
          alignSelf={"center"}
          variant={TVariant.Body14}
          ml={3}
          color={isError ? "red.500" : "gray.500"}
          wordBreak={"break-word"}
        >
          {children}
        </Typography>
      </Flex>
    </>
  );
}

BigInput.Number = BigInputNumber;
BigInput.Select = BigInputSelect;
BigInput.Emblem = BigInputEmblem;
export default BigInput;
