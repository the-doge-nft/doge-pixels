import { Grid, GridItem } from "@chakra-ui/react";

interface GridPaneProps {
    colors: string[],
    onClick?: (index: number) => void;
    isGrid: boolean,
    variant?: "solid" | "shadow";
}

const ColorPane = ({ colors, onClick, isGrid, variant = "solid"}: GridPaneProps) => {
    // const styles = useMultiStyleConfig("ColorPane", {variant: variant})
    return <Grid
          border="none"
          width="400px"
          templateColumns={'repeat(20, 1fr)'}   
          id={isGrid? ' ' : 'my-art'}
        >
            {
                colors.map((color, index) => {
                    return (
                        <GridItem 
                            width="20px"
                            height="20px"
                            border="none"
                            bg={isGrid? color : (color === 'white' ? 'none' : color)} 
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
