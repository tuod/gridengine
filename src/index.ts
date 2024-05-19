import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

// Угол 60 градусов в радианах (любой угол гексагона)
const angle60inRadian = (2 * Math.PI) / 6;

function roundedArray(arr: number[], digits: number) {
  let resultArray: number[] = [];
  arr.forEach((element) => {
    resultArray.push(parseFloat(element.toFixed(digits)));
  });
  return resultArray;
}

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

class Line {
  first: Point;
  second: Point;
  constructor(first: Point, second: Point) {
    this.first = first;
    this.second = second;
  }
  draw(ctx: CanvasRenderingContext2D, passMove: boolean = true) {
    if (!passMove) {
      ctx.moveTo(Math.round(this.first.x), Math.round(this.first.y));
    }
    ctx.lineTo(Math.round(this.second.x), Math.round(this.second.y));
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
    return this
  }
}

const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
// const overlayCanvas = document.getElementById("overlayCanvas");
let ctx = (gridCanvas.getContext("2d") as CanvasRenderingContext2D);
new Hexagon(new Point(50, 50), 50).drawBorder(ctx)
