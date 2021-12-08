import React from "react";
import { FormControl, FormControlProps, FormLabel, Grid, GridItem } from "@chakra-ui/react";
import { useField } from "react-final-form";
import Typography, { TVariant } from "../Typography/Typography";

interface ControlProps extends FormControlProps {
  name: string;
  label?: string;
  horizontal?: boolean;
}

const Control = ({ name, children, label, horizontal = false, ...rest }: ControlProps) => {
  const { meta } = useField(name, { subscription: { touched: true, error: true, pristine: true, visited: true } });
  return (
    <FormControl id={name} w={"100%"} isInvalid={meta.error && meta.touched} {...rest}>
      <Grid templateColumns={horizontal ? "1fr 1fr" : undefined} w={"100%"}>
        <GridItem>
          {label && (
            <FormLabel htmlFor={name} mb={1}>
              <Typography variant={TVariant.PresStart15}>{label}</Typography>
            </FormLabel>
          )}
        </GridItem>
        <GridItem>{children}</GridItem>
      </Grid>
    </FormControl>
  );
};

export default Control;
