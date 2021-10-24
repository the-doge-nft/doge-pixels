import React from "react";
import {Box, Flex} from "@chakra-ui/react";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import Button, {ButtonVariant} from "../DSL/Button/Button";
import {useHistory, useLocation} from "react-router-dom";
import routes from "../App.routes";

interface AppLayoutProps {
    children?: any
}

const AppLayout = ({children}: AppLayoutProps) => {
    const location = useLocation()
    const history = useHistory()
    console.log("location::", location)
    return  <Box w={"100vw"} h={"100vh"} py={3} px={8}>
        <Flex mb={3} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant={TVariant.Title28} color={"black"}>Pupper Pixel Portal 🐕</Typography>
            <Box>
                {routes.map((route) => {
                    const isSelected = location.pathname === route.path
                    return <Button
                        variant={ButtonVariant.Gray}
                        textDecoration={isSelected ? "underline" : "none"}
                        onClick={() => history.push(route.path)}
                    >
                        {route.title}
                    </Button>
                })}
                <Button ml={5}>Connect Wallet</Button>
            </Box>
        </Flex>
        {children}
    </Box>
}

export default AppLayout;
