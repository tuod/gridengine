import _ from "lodash";
import { OffsetRadiusRatio } from "./models/geometry/Offset";
import { HexGrid } from "./models/geometry/HexGrid";
import { initialHexRadius } from "./consts";

const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
new HexGrid(
  initialHexRadius,
  gridCanvas,
  new OffsetRadiusRatio(1.1, 1),
  new OffsetRadiusRatio(0.5, -0.5)
);
