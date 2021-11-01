import React from "react";
import {Text} from "@chakra-ui/react";
import {TextProps} from "@chakra-ui/layout/dist/types/text";

export enum TVariant {
    Detail12 = "Detail12",
    Detail14 = "Detail14",
    Detail16 = "Detail16",
    Body12 = "Body12",
    Body14 = "Body14",
    Body16 = "Body16",
    Body18 = "Body18",
    Body20 = "Body20",
    Title22 = "Title22",
    Title28 = "Title28",
    Title45 = "Title45"
}

interface TypographyProps extends TextProps {
    variant: TVariant;
    children?: any;
    block?: boolean;
}

const Typography = ({
                        children,
                        block,
                        variant,
                        ...rest
}: TypographyProps) => {
    return <Text
        as={block ? "div" : "span"}
        variant={variant}
        _hover={{}}
        {...rest}
    >
        {children}
    </Text>
}

export default Typography
