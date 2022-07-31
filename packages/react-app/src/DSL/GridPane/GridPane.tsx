import { useState } from "react";
import { Grid, GridItem } from "@chakra-ui/react";

interface GridPaneProps {
    colors: string[],
    onClick?: (index: number) => void;
    isGrid: boolean,
    type?: string,
    variant?: "solid" | "shadow";
}

const GridPane = ({ colors, onClick, isGrid, type, variant = "solid"}: GridPaneProps) => {
    // const styles = useMultiStyleConfig("GridPane", {variant: variant})
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const onMouseMove = (index: number) => {
        if (!isMouseDown) return;
        if (selectedIndex != index) {
            setSelectedIndex(index)
            onClick && onClick(index);
        }

    }

    const onMouseDown = (index: number) => {
        setIsMouseDown(true);
        setSelectedIndex(index);
    }

    const onMouseUp = (index: number) => {
        setIsMouseDown(false);
        setSelectedIndex(-1);
    }
    return <Grid
          border="none"
          width="400px"
          templateColumns={'repeat(20, 1fr)'}   
          id={isGrid? ' ' : 'my-art'}
          cursor = {`url('./${type}.png') 10 20, auto;`}
        >
            {
                colors.map((color, index) => {
                    return (
                        <GridItem 
                            width="20px"
                            height="20px"
                            border="none"
                            bg={isGrid? color : (color === 'white' ? 'none' : color)} 
                            key={`grid_${index}`}
                            onClick={() => onClick && onClick(index)}
                            onMouseDown = {() => onMouseDown(index)}
                            onMouseUp={() => onMouseUp(index)}
                            onMouseMove = {() => onMouseMove(index)}
                            onmouseOut = {() => onMouseUp(index)}
                        />
                    )
                })
            }
    </Grid>
}

export default GridPane;
