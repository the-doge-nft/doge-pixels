import { Point } from "./Point";

export class SnakePart extends Point {
  swap(part: SnakePart) {
    this.x = part.x;
    this.y = part.y;
  }
}

export class Snake {
  tail: SnakePart[] = [];
  constructor(x: number, y: number, length: number) {
    for (let cn = 0; cn < length; ++cn) {
      this.tail.push(new SnakePart(x, y + cn));
    }
  }

  head(): SnakePart {
    return this.tail[0];
  }

  last(): SnakePart {
    return this.tail[this.tail.length - 1];
  }

  move(x: number, y: number, eating: boolean) {
    if (eating) {
      this.tail.splice(0, 0, new SnakePart(x, y));
    } else {
      for (let cn = 0; cn < this.tail.length - 1; ++cn) {
        this.tail[this.tail.length - cn - 1].swap(this.tail[this.tail.length - cn - 2]);
      }
      this.tail[0].x = x;
      this.tail[0].y = y;
    }
  }

  hits(x: number, y: number): boolean {
    const index = this.tail.findIndex(entry => {
      return entry.x === x && entry.y === y;
    });
    return index >= 0;
  }
}
