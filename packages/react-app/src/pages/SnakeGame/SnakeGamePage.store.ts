import { makeObservable, observable } from "mobx";
import { EmptyClass } from "../../helpers/mixins";
import { Reactionable } from "../../services/mixins/reactionable";
import { SnakeGame } from "./SnakeGame";

class SnakeGamePageStore extends Reactionable(EmptyClass) {
  @observable
  selectedAddress: string;

  snakeGame: SnakeGame;

  constructor() {
    super();
    makeObservable(this);

    this.selectedAddress = "0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5";

    this.snakeGame = new SnakeGame();
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.snakeGame.setCanvas(canvas);
  }
}

export default SnakeGamePageStore;
