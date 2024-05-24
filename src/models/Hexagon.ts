import { v4 as uuidv4 } from "uuid";
import { roundUp } from "../helpers";
import { angle60inRadian } from "../consts";
import { Point } from "./Point";
import { Offset } from "./Offset";
import { Line } from "./Line";

export class Hexagon {
  center: Point;
  radius: number;
  key?: number | string;
  constructor(center: Point, radius: number, key?: number | string) {
    this.center = center;
    this.radius = radius;
    this.key = key !== undefined ? key : uuidv4();
  }

  private getVertice(index: number): Point {
    let x = this.center.x + this.radius * Math.cos(angle60inRadian * index);
    let y = this.center.y + this.radius * Math.sin(angle60inRadian * index);
    return new Point(x, y);
  }

  drawBorder(ctx: CanvasRenderingContext2D, borderWidthRadiusRatio: number) {
    ctx.globalAlpha = 1;
    ctx.lineWidth = roundUp(this.radius * borderWidthRadiusRatio, 0);
    ctx.lineJoin = "round";
    ctx.beginPath();

    for (let i = 0; i < 5; i++) {
      let line = new Line(this.getVertice(i), this.getVertice(i + 1));
      line.draw(ctx, i == 0 ? false : true);
    }
    ctx.closePath();
    ctx.stroke();
    return this;
  }

  drawText(text: string, ctx: CanvasRenderingContext2D, offset = new Offset()) {
    ctx.globalAlpha = 0.8;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = this.radius * 0.4 + "px serif";
    ctx.fillStyle = "black";
    ctx.fillText(
      text,
      Math.round(this.center.x + offset.x),
      Math.round(this.center.y + offset.y)
    );
    return this;
  }
}
