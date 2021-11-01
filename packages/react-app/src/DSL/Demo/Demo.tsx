import React from "react";
import {Box} from "@chakra-ui/react";
import Typography, {TVariant} from "../Typography/Typography";

interface DemoProps extends React.Props<any>{
    title: string;
}

const Demo = ({title, children}: DemoProps) => {
    return <Box
        w={"100%"}
        border={"2px solid"}
        borderColor={"gray.100"}
        borderRadius={5}
        bg={"white"}
        p={5}
        mb={5}
    >
        <Typography
            variant={TVariant.Body16}
            block
            mb={3}
        >
            {title}
        </Typography>
        {children}
    </Box>
}

export default Demo
