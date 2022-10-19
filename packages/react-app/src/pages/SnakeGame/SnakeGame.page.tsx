import { Box, Grid, GridItem } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { SnakeMoveDirection } from "./SnakeGame";
import SnakeGamePageStore from "./SnakeGamePage.store";

const GAME_FIELD_SIZE = 512;

const SnakeGamePage = observer(function SnakeGamePage() {
  const store = useMemo(() => new SnakeGamePageStore(), []);

  return (
    <Pane display={"flex"} flexDirection={"column"} padding={"0px"}>
      <Typography variant={TVariant.PresStart10} m={2}>
        {store.selectedAddress}
      </Typography>
      <Grid templateColumns={"0fr 1fr"} flexGrow={0}>
        <GridItem display={"flex"} flexDirection={"column"} flexGrow={0}>
          <GameComponent store={store} />
        </GridItem>
      </Grid>
    </Pane>
  );
});

const GameComponent = observer(({ store }: { store: SnakeGamePageStore }) => {
  useEffect(() => {
    let canvas: HTMLCanvasElement = document.getElementById("gamecanvas") as HTMLCanvasElement;
    store.setCanvas(canvas);
    let intervalId = setInterval(onTick, 500);
    document.addEventListener("keydown", handleHotkeys, false);

    return () => {
      clearInterval(intervalId);
    };
  });

  const handleHotkeys = (e: KeyboardEvent) => {
    if (e.code === "ArrowUp") {
      e.preventDefault();
      store.snakeGame.setMoveDirection(SnakeMoveDirection.up);
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      store.snakeGame.setMoveDirection(SnakeMoveDirection.down);
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      store.snakeGame.setMoveDirection(SnakeMoveDirection.left);
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      store.snakeGame.setMoveDirection(SnakeMoveDirection.right);
    }
  };

  const onTick = () => {
    store.snakeGame.tick();
  };

  return (
    <Box
      border={"1px solid gray"}
      margin={"5px"}
      background={
        "linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), white"
      }
      backgroundRepeat={"repeat, repeat"}
      backgroundPosition={"0px 0, 8px 8px"}
      transformOrigin={"0 0 0"}
      backgroundClip={"border-box, border-box"}
      backgroundSize={"16px 16px, 16px 16px"}
    >
      <canvas id="gamecanvas" width={GAME_FIELD_SIZE} height={GAME_FIELD_SIZE} />
    </Box>
  );
});

export default SnakeGamePage;
