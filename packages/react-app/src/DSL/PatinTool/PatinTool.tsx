import { useState, useRef } from "react";
import { Flex, Image } from "@chakra-ui/react";
import PencilIcon from "../../images/pencil.png"
import EraserIcon from "../../images/eraser.png"

interface PaintToolProps {
    x: number,
    y: number,
    onDrawTool: (type: string) => void;
    onMouseMove: (x: number, y: number) => void;
    variant?: "solid" | "shadow";
}

const PaintTool = ({ x, y, onDrawTool, onMouseMove}: PaintToolProps) => {
    // const styles = useMultiStyleConfig("PaintTool", {variant: variant})
    const [intiPosition, setInitPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
    const dragItem = useRef();
    const dragOverItem = useRef();

    const dragStart = (e: any) => {
        setInitPosition({x: e.clientX, y: e.clientY})
      };
     
     const drop = (e: any) => {
        onMouseMove(e.clientX - intiPosition.x, e.clientY - intiPosition.y);
      };
    return (
        <Flex
            border="1px solid black"
            width="41px"
            height="90px"
            flexDirection={"column"}
            position="absolute"
            top={y}
            left={x}
            alignItems="center"
            onDragStart={(e: any) => dragStart(e)}
            onDragEnd={drop}
            draggable
            >
                <Flex 
                    width={"100%"} 
                    height={"30px"} 
                    borderBottom="1px solid black" 
                    cursor={"pointer"}
                  
                />
                <Image
                    src={PencilIcon}
                    width="13px"
                    height="21px"
                    marginTop={"10px"}
                    cursor="pointer"
                    onClick={() => onDrawTool('pencil')}
                    />
                <Image
                    src={EraserIcon}
                    width="13px"
                    height="18px"
                    marginTop={"10px"}
                    marginBottom={"10px"}
                    cursor="pointer"
                    onClick={() => onDrawTool('eraser')}
                    />
                
        </Flex>
    )
}

export default PaintTool;
