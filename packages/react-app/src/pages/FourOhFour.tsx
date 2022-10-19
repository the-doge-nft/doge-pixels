import React from "react";
import Typography, { TVariant } from "../DSL/Typography/Typography";
import { Flex, useColorMode } from "@chakra-ui/react";
import Link from "../DSL/Link/Link";
import { NamedRoutes, route } from "../App.routes";
import { lightOrDarkMode } from "../DSL/Theme";
import Button from "../DSL/Button/Button";

const FourOhFour = () => {
  const { colorMode } = useColorMode();
  return (
    <Flex justifyContent={"center"} alignItems={"center"} w={"full"}>
      <Flex flexDir={"column"} alignItems={"center"} gap={5}>
        <Typography variant={TVariant.PresStart20}>Couldn't find what you were looking for</Typography>
        <Link href={route(NamedRoutes.VIEWER)}>
          <Button>Back to Doge</Button>
        </Link>
        <Typography variant={TVariant.PresStart10} color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}>
          (did you know Kabosu's birthday is November 2nd, 2005)
        </Typography>
      </Flex>
    </Flex>
  );
};

export default FourOhFour;
