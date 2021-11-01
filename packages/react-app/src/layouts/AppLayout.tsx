import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Typography, { TVariant } from "../DSL/Typography/Typography";
import Button, { ButtonVariant } from "../DSL/Button/Button";
import { useHistory, useLocation } from "react-router-dom";
import routes from "../App.routes";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const history = useHistory();
  return (
    <Flex w={"100vw"} h={"100vh"} p={5} direction={"column"}>
      <Flex mb={3} justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant={TVariant.Title28} color={"black"}>
          Pupper Pixel Portal 🐕
        </Typography>
        <Box>
          {routes.map((route, index) => {
            const isSelected = location.pathname === route.path;
            return (
              <Button
                key={`${route.path}:${index}`}
                variant={ButtonVariant.Text}
                textDecoration={isSelected ? "underline" : "none"}
                onClick={() => history.push(route.path)}
              >
                {route.title}
              </Button>
            );
          })}
          <Button ml={5}>
            <Typography variant={TVariant.Body14}>Connect Wallet</Typography>
          </Button>
        </Box>
      </Flex>
      {children}
    </Flex>
  );
};

export default AppLayout;
