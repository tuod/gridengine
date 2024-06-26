import { angle60inRadian, maxHexRadius, minHexRadius } from "../../consts";
import { Hexagon } from "./Hexagon";
import { Offset, OffsetRadiusRatio } from "./Offset";
import { Point } from "./Point";
import { ITextStyle } from "./Style";

export class HexGrid {
  hexRadius: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  startOffset: OffsetRadiusRatio;
  endOffset: OffsetRadiusRatio;
  constructor(
    hexRadius: number,
    canvas: HTMLCanvasElement,
    startOffset: OffsetRadiusRatio,
    endOffset: OffsetRadiusRatio
  ) {
    this.hexRadius = hexRadius;
    this.canvas = canvas;
    this.startOffset = startOffset;
    this.endOffset = endOffset;
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
        { passive: false }
      );
    });
  }

  handleEvent(event: Event): void {
    switch (event.type) {
      case "mousewheel":
        let wheelEvent = event as WheelEvent;
        wheelEvent.preventDefault();
        if (wheelEvent.deltaY >= 0) {
          if (this.hexRadius < maxHexRadius) {
            this.hexRadius = Math.round(this.hexRadius * 1.1);
          }
        } else {
          if (this.hexRadius > minHexRadius) {
            this.hexRadius = Math.round(this.hexRadius * 0.9);
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

  drawHex(hex: Hexagon) {
    let textStyle: ITextStyle = {
      globalAlpha: 0.8,
      textAlign: "center",
      textBaseline: "middle",
      font: this.hexRadius * 0.4 + "px serif",
      fillStyle: "black",
    };
    hex
      .drawBorder(this.ctx, 0.05)
      .drawText(
        "#" + hex.key,
        this.ctx,
        new Offset(0, this.hexRadius * -0.35),
        textStyle
      )
      .drawText("x: " + hex.center.x, this.ctx, new Offset(0, 0), textStyle)
      .drawText(
        "y: " + hex.center.y,
        this.ctx,
        new Offset(0, this.hexRadius * 0.35),
        textStyle
      );
  }

  draw() {
    this.fitCanvasToWindow();
    this.drawGrid();
    return this;
  }

  private drawGrid() {
    let a = angle60inRadian,
      r = this.hexRadius,
      w = this.canvas.width,
      h = this.canvas.height,
      hexNum = 0,
      firstHexInLineY = 0;
    // Строки
    for (
      let y = Math.round(r * this.startOffset.y);
      y + r * Math.sin(a) < h + r * this.endOffset.y;
      y += Math.round(
        r * (Math.round(firstHexInLineY) == Math.round(y) ? 2 : 1) * Math.sin(a)
      )
    ) {
      firstHexInLineY = y;
      // Столбцы
      for (
        let x = Math.round(r * this.startOffset.x), j = 0;
        x + r * (1 + Math.cos(a)) < w + r * this.endOffset.x;
        x += Math.round(r * (1 + Math.cos(a))),
          y += Math.round((-1) ** j++ * r * Math.sin(a))
      ) {
        let hex = new Hexagon(<Point>{ x: x, y: y }, r, hexNum);
        this.drawHex(hex);
        hexNum += 1;
      }
    }
  }
}
