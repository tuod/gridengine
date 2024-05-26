import { v4 as uuidv4 } from "uuid";
import { roundUp } from "../../helpers";
import { angle60inRadian } from "../../consts";
import { Point } from "./Point";
import { Offset } from "./Offset";
import { Line } from "./Line";
import { CanvasText } from "./CanvasText";
import { ITextStyle } from "./Style";

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
    return <Point>{ x: x, y: y };
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

  drawText(text: string, ctx: CanvasRenderingContext2D, offset = new Offset(), style?: ITextStyle) {
    new CanvasText(
      text,
      { x: this.center.x + offset.x, y: this.center.y + offset.y },
      style
    ).draw(ctx);
    return this;
  }
}
