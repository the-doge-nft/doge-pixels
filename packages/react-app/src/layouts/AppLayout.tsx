import React from "react";
import { Box, Flex, HStack, useColorMode } from "@chakra-ui/react";
import Typography, { TVariant } from "../DSL/Typography/Typography";
import Button, { ButtonVariant } from "../DSL/Button/Button";
import { useHistory, useLocation } from "react-router-dom";
import routes from "../App.routes";
import Icon from "../DSL/Icon/Icon";
import Tabs from "../DSL/Tabs/Tabs";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const history = useHistory();
  const { colorMode } = useColorMode();
  return (
    <Flex w={"100vw"} h={"100vh"} p={5} direction={"column"}>
      <Flex mb={3} justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant={TVariant.Title28}>Pupper Pixel Portal 🐕</Typography>
        <Flex alignItems={"center"}>
            <HStack spacing={3}>
                <Tabs
                    items={routes.map(route => route.title)}
                    onChange={(index) => history.push(routes[index].path)}
                    index={routes.map(route => route.path).indexOf(location.pathname)}
                />
                {/*{routes.map((route, index) => {*/}
                {/*    const isActive = location.pathname === route.path;*/}
                {/*    return (*/}
                {/*        <Tabs*/}
                {/*            isActive={isActive}*/}
                {/*            key={`${route.path}:${index}`}*/}
                {/*            onClick={() => history.push(route.path)}*/}
                {/*            title={route.title}*/}
                {/*        />*/}
                {/*    );*/}
                {/*})}*/}
            </HStack>
          <ThemeChangeButton />
          <Button ml={5}>Connect Wallet</Button>
        </Flex>
      </Flex>
      {children}
    </Flex>
  );
};

const ThemeChangeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box ml={3}>
      <Icon
        icon={colorMode === "light" ? "moon" : "sun"}
        color={colorMode === "light" ? "black" : "white"}
        cursor={"pointer"}
        onClick={toggleColorMode}
      />
    </Box>
  );
};

export default AppLayout;
