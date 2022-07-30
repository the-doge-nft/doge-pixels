import { Grid, GridItem } from "@chakra-ui/react";

interface GridPaneProps {
    colors: string[],
    onClick?: (index: number) => void;
    variant?: "solid" | "shadow";
}

const ColorPane = ({ colors, onClick, variant = "solid"}: GridPaneProps) => {
    // const styles = useMultiStyleConfig("ColorPane", {variant: variant})
    return <Grid
          zIndex={1}
          border="none"
          width="400px"
          templateColumns={'repeat(20, 1fr)'}   

        >
            {
                colors.map((color, index) => {
                    return (
                        <GridItem 
                            width="20px"
                            height="20px"
                            border="none"
                            bg={color} 
                            cursor="pointer"
                            key={`grid_${index}`}
                            onClick={() => onClick && onClick(index)}
                        />
                    )
                })
            }
    </Grid>
}

export default ColorPane;
