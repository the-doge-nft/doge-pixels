import React from "react";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import {Flex} from "@chakra-ui/react";

const FourOhFour = () => {
    return <Flex justifyContent={"center"} alignItems={"center"} w={"full"}>
        <Flex flexDir={"column"} alignItems={"center"} gap={5}>
            <Typography variant={TVariant.PresStart20}>
                Couldn't find what you were looking for
            </Typography>
            <Typography variant={TVariant.PresStart10}>
                (did you know Kabosu's birthday is November 2nd, 2005)
            </Typography>
        </Flex>
    </Flex>
}

export default FourOhFour
