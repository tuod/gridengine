import { Point } from "./Point";

export class Line {
  first: Point;
  second: Point;
  constructor(first: Point, second: Point) {
    this.first = first;
    this.second = second;
  }
  draw(ctx: CanvasRenderingContext2D, passMove: boolean = true): this {
    if (!passMove) {
      ctx.moveTo(Math.round(this.first.x), Math.round(this.first.y));
    }
    ctx.lineTo(Math.round(this.second.x), Math.round(this.second.y));
    return this;
  }
}
