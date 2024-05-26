import { Point } from "./Point";
import { ITextStyle } from "./Style";

export class CanvasText {
  message: string;
  position: Point;
  style?: ITextStyle;
  maxWidth?: number;

  constructor(
    message: string,
    position: Point,
    style?: ITextStyle,
    maxWidth?: number
  ) {
    this.message = message;
    this.position = position;
    this.style = style;
    this.maxWidth = maxWidth;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let prop in this.style) {
      prop = prop as any;
      let value = this.style[prop as keyof typeof this.style];
      (ctx as any)[prop] = value;
    }
    ctx.fillText(
      this.message,
      Math.round(this.position.x),
      Math.round(this.position.y),
      this.maxWidth
    );
    return this;
  }
}
