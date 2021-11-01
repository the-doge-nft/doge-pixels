import React from "react";
import {Box, Flex, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import Button, {ButtonVariant} from "../DSL/Button/Button";
import {useHistory, useLocation} from "react-router-dom";
import routes from "../App.routes";
import Icon from "../DSL/Icon/Icon";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const history = useHistory();
  const {colorMode} = useColorMode()
  return (
    <Flex w={"100vw"} h={"100vh"} p={5} direction={"column"}>
      <Flex mb={3} justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant={TVariant.Title28}>
          Pupper Pixel Portal 🐕
        </Typography>
        <Flex alignItems={"center"}>
          {routes.map((route, index) => {
            const isSelected = location.pathname === route.path;
            //@TODO: create a Tab component - button should not handle text decoration
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
          <ThemeChangeButton />
          <Button ml={5}>
            Connect Wallet
          </Button>
        </Flex>
      </Flex>
      {children}
    </Flex>
  );
};

const ThemeChangeButton = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  return <Box ml={3}>
    <Icon
        icon={colorMode === "light" ? "moon" : "sun"}
        color={colorMode ===  "light" ? "black" : "white"}
        cursor={"pointer"}
        onClick={toggleColorMode}
    />
  </Box>
}

export default AppLayout;
