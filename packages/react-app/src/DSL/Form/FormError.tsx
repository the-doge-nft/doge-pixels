import React from "react";
import { Box } from "@chakra-ui/react";
import Typography, { TVariant } from "../Typography/Typography";

interface FormErrorProps {
  error: string;
}

const FormError = ({ error }: FormErrorProps) => {
  return (
    <Box textAlign={"center"} mt={4}>
      <Typography color={"red.500"} variant={TVariant.ComicSans16}>
        {error}
      </Typography>
    </Box>
  );
};

export default FormError;
