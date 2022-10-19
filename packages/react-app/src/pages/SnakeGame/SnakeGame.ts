import { Point } from "./Point";
import { Snake } from "./Snake";

export const TRANSPARENT_PIXEL = "#0000";

export enum SnakeMoveDirection {
  up = 0,
  right,
  down,
  left,
}

class FoodContainer {
  food: Point[];

  constructor() {
    this.food = [];
  }

  hasFood(x: number, y: number) {
    const food = this.food.find(entry => {
      return entry.x === x && entry.y === y;
    });

    return food !== undefined;
  }

  addFood(x: number, y: number) {
    this.food.push(new Point(x, y));
  }

  eatFood(x: number, y: number) {
    const index = this.food.findIndex(entry => {
      return entry.x === x && entry.y === y;
    });
    this.food.splice(index, 1);
  }
}

export class SnakeGame {
  snake: Snake;
  fieldWidht: number;
  fieldHeight: number;
  foodContainer: FoodContainer;
  moveDirection: SnakeMoveDirection;
  lost: boolean;
  canvas?: HTMLCanvasElement;

  constructor() {
    this.fieldWidht = 16;
    this.fieldHeight = 16;
    this.snake = new Snake(this.fieldWidht / 2, this.fieldHeight / 2, 4);
    this.moveDirection = SnakeMoveDirection.up;
    this.lost = false;

    this.foodContainer = new FoodContainer();
    const { foodX, foodY } = this.spawnFood();
    this.foodContainer.addFood(foodX, foodY);
  }

  setMoveDirection(direction: SnakeMoveDirection) {
    this.moveDirection = direction;
  }

  tick() {
    if (this.lost) {
      return;
    }

    let x = this.snake.head().x;
    let y = this.snake.head().y;

    let lastX = this.snake.last().x;
    let lastY = this.snake.last().y;

    if (this.moveDirection === SnakeMoveDirection.up) {
      --y;
    } else if (this.moveDirection === SnakeMoveDirection.down) {
      ++y;
    }
    if (this.moveDirection === SnakeMoveDirection.right) {
      ++x;
    }
    if (this.moveDirection === SnakeMoveDirection.left) {
      --x;
    }

    if (x < 0 || y < 0 || x >= this.fieldWidht || y >= this.fieldHeight || this.snake.hits(x, y)) {
      console.log("lost");
      this.lost = true;
    } else {
      const hasFood = this.foodContainer.hasFood(x, y);
      this.snake.move(x, y, hasFood);
      this.drawPixel(x, y, "#00FF");

      if (hasFood) {
        this.foodContainer.eatFood(x, y);
        const { foodX, foodY } = this.spawnFood();
        this.foodContainer.addFood(foodX, foodY);
        this.drawPixel(foodX, foodY, "#F0FF");
      } else {
        this.drawPixel(lastX, lastY, TRANSPARENT_PIXEL);
      }
    }
  }

  spawnFood() {
    let foodX: number;
    let foodY: number;

    do {
      foodX = Math.floor(Math.random() * this.fieldWidht);
      foodY = Math.floor(Math.random() * this.fieldHeight);
    } while (this.snake.hits(foodX, foodY));

    return { foodX, foodY };
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.updateField();
  }

  updateField() {
    if (!this.canvas) return;

    let ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let snakePart of this.snake.tail) {
      this.drawPixel(snakePart.x, snakePart.y, "#00FF");
    }
    for (let food of this.foodContainer.food) {
      this.drawPixel(food.x, food.y, "#F0FF");
    }
  }

  drawPixel(x: number, y: number, color: string) {
    if (!this.canvas) return;

    let ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const cellSizeX = this.canvas.width / this.fieldWidht;
    const cellSizeY = this.canvas.height / this.fieldHeight;

    if (color === TRANSPARENT_PIXEL) {
      ctx.clearRect(x * cellSizeX + 1, y * cellSizeY + 1, cellSizeX - 2, cellSizeY - 2);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x * cellSizeX + 1, y * cellSizeY + 1, cellSizeX - 2, cellSizeY - 2);
    }
  }
}
