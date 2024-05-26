interface IStyle {
  globalAlpha?: number;
  fillStyle?: string | CanvasGradient | CanvasPattern;
}
export interface ITextStyle extends IStyle {
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  font?: string;
}

