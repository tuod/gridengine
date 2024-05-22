import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

// Угол 60 градусов в радианах (любой угол гексагона)
const angle60inRadian = (2 * Math.PI) / 6;

function roundUp(num: number, precision: number) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Offset {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Line {
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

class Hexagon {
  center: Point;
  radius: number;
  key: number | string;
  constructor(center: Point, radius: number, key?: number | string) {
    this.center = center;
    this.radius = radius;
    this.key = key ? key : uuidv4();
  }

  private getVertice(index: number): Point {
    let x = this.center.x + this.radius * Math.cos(angle60inRadian * index);
    let y = this.center.y + this.radius * Math.sin(angle60inRadian * index);
    return new Point(x, y);
  }

  drawBorder(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = 1;
    ctx.lineWidth = roundUp(this.radius / 40, 0);
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

class HexGrid {
  hexRadius: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(hexRadius: number, canvas: HTMLCanvasElement) {
    this.hexRadius = hexRadius;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    Object.entries({
      load: window,
      resize: window,
      mousewheel: document,
    }).forEach(([eventName, sourceObject]) => {
      sourceObject.addEventListener(
        eventName,
        (event): void => {
          this.handleEvent(event);
        },
        false
      );
    });
  }

  handleEvent(event: Event): void {
    switch (event.type) {
      case "mousewheel":
        let wheelEvent = event as WheelEvent;
        if (wheelEvent.deltaY >= 0) {
          if (this.hexRadius < 100) {
            this.hexRadius += 1;
          }
        } else {
          if (this.hexRadius > 25) {
            this.hexRadius -= 1;
          }
        }
      default:
        this.draw();
    }
  }

  fitCanvasToWindow() {
    this.canvas.width = window.innerWidth - 25;
    this.canvas.height = window.innerHeight - 25;
  }

  draw() {
    this.fitCanvasToWindow();
    new Hexagon(new Point(this.hexRadius, this.hexRadius), this.hexRadius)
      .drawBorder(this.ctx)
      .drawText("top", this.ctx, new Offset(0, this.hexRadius * -0.35))
      .drawText("middle", this.ctx)
      .drawText("bottom", this.ctx, new Offset(0, this.hexRadius * 0.35));
  }
}

const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
// const overlayCanvas = document.getElementById("overlayCanvas");
new HexGrid(50, gridCanvas);
