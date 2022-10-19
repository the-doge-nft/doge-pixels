import { observer } from "mobx-react-lite";
import Modal from "../../DSL/Modal/Modal";
import { Box } from "@chakra-ui/react";
import PixelArtPageStore from "./PixelArtPage.store";
import Button, { ButtonVariant } from "../../DSL/Button/Button";
import { useEffect, useRef, useState } from "react";
import Select from "../../DSL/Select/Select";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import AppStore from "../../store/App.store";
import { CANVAS_SIZES } from "./PixelArtCanvas";
import TemplateComponent from "./TemplateComponent";

const CANVAS_ELEMENT_SIZE = 256;
const CANVAS_ELEMENT_MARGIN = 80;

interface CanvasPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: PixelArtPageStore;
}

const CanvasPropertiesModal = observer((props: CanvasPropertiesModalProps) => {
  const [left, setLeft] = useState(props.store.templateLeft);
  const [top, setTop] = useState(props.store.templateTop);
  const [width, setWidth] = useState(props.store.templateWidth);
  const [height, setHeight] = useState(props.store.templateHeight);
  const [backgroundPos, setBackgroundPos] = useState("");
  const [backgroundSize, setBackgroundSize] = useState("");
  const [canvasSize, setCanvasSize] = useState(props.store.pixelsCanvas.getSizeInfo().id);
  const [scale, setScale] = useState(1);
  const canvas = useRef<HTMLCanvasElement>();

  useEffect(() => {
    const cellSize = CANVAS_ELEMENT_SIZE / props.store.pixelsCanvas.canvasSize;
    setBackgroundPos(`0px 0px, ${cellSize}px ${cellSize}px`);
    setBackgroundSize(`${cellSize * 2}px ${cellSize * 2}px, ${cellSize * 2}px ${cellSize * 2}px`);
    setScale(getScale());
  }, []);

  useEffect(() => {
    //console.log(canvas);
    if (canvas.current) {
      props.store.pixelsCanvas.updateCanvasEx(canvas.current);
    }
  });

  useEffect(() => {
    let size = CANVAS_SIZES.find(value => {
      return value.id === canvasSize;
    });
    if (size) {
      const cellSize = CANVAS_ELEMENT_SIZE / size.value;
      setBackgroundPos(value => `0px 0px, ${cellSize}px ${cellSize}px`);
      setBackgroundSize(value => `${cellSize * 2}px ${cellSize * 2}px, ${cellSize * 2}px ${cellSize * 2}px`);
    }
  }, [canvasSize]);

  useEffect(() => {
    setScale(getScale());
  }, [AppStore.rwd.isMobile]);

  const getScale = () => {
    return AppStore.rwd.isMobile ? 0.75 : 1;
  };

  const onApply = () => {
    props.store.templateLeft = left;
    props.store.templateTop = top;
    props.store.templateWidth = width;
    props.store.templateHeight = height;

    if (props.store.pixelsCanvas.getSizeInfo().id !== canvasSize) {
      let size = CANVAS_SIZES.find(value => {
        return value.id === canvasSize;
      });
      if (size) {
        props.store.pixelsCanvas.resize(size.value);
        props.store.clearActions();
      }
    }

    props.onClose();
  };

  const onReset = () => {
    props.onClose();
  };

  const onDrag = (left: number, top: number, width: number, height: number) => {
    setLeft(left);
    setTop(top);
    setWidth(width);
    setHeight(height);
  };

  return (
    <Modal size={"lg"} isOpen={props.isOpen} onClose={props.onClose} title={"Canvas Properties"}>
      <Box pt={5} pb={6}>
        <Box display={"flex"} justifyContent={"space-evenly"} alignItems={"center"}>
          <Typography variant={TVariant.PresStart15}>Canvas Size:</Typography>
          <Box w={"150px"}>
            <Select
              items={CANVAS_SIZES}
              value={canvasSize}
              onChange={(value: any) => {
                setCanvasSize(value);
              }}
            />
          </Box>
        </Box>
        <Box
          width={(CANVAS_ELEMENT_SIZE + CANVAS_ELEMENT_MARGIN * 2) * scale}
          height={(CANVAS_ELEMENT_SIZE + CANVAS_ELEMENT_MARGIN * 2) * scale}
          mx={"auto"}
          my={"5px"}
          overflow={"hidden"}
          border={"1px dotted gray"}
        >
          <Box
            position={"relative"}
            width={CANVAS_ELEMENT_SIZE * scale + "px"}
            height={CANVAS_ELEMENT_SIZE * scale + "px"}
            top={CANVAS_ELEMENT_MARGIN * scale + "px"}
            left={CANVAS_ELEMENT_MARGIN * scale + "px"}
          >
            <TemplateComponent
              store={props.store}
              width={CANVAS_ELEMENT_SIZE * scale}
              height={CANVAS_ELEMENT_SIZE * scale}
              onChange={onDrag}
            />
            <Box
              border={"1px solid gray"}
              background={
                "linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), rgba(1, 1, 1, 0)"
              }
              backgroundRepeat={"repeat, repeat"}
              backgroundPosition={backgroundPos}
              transformOrigin={"0 0 0"}
              backgroundClip={"border-box, border-box"}
              backgroundSize={backgroundSize}
              position={"relative"}
              width={CANVAS_ELEMENT_SIZE * scale}
              height={CANVAS_ELEMENT_SIZE * scale}
              top={-height * scale * CANVAS_ELEMENT_SIZE + "px"}
              pointerEvents={"none"}
            />
            <canvas
              style={{
                position: "relative",
                top: -height * scale * CANVAS_ELEMENT_SIZE - CANVAS_ELEMENT_SIZE * scale + "px",
                pointerEvents: "none",
                opacity: 0.25,
              }}
              ref={canvas}
              id="canvas-preview"
              width={CANVAS_ELEMENT_SIZE * scale}
              height={CANVAS_ELEMENT_SIZE * scale}
            />
          </Box>
        </Box>
        <Box display={"flex"} justifyContent={"center"}>
          <Button p={0} margin={"0 auto"} variant={ButtonVariant.Primary} onClick={onApply}>
            Apply
          </Button>
          <Button p={0} margin={"0 auto"} variant={ButtonVariant.Primary} onClick={onReset}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
});

export default CanvasPropertiesModal;
