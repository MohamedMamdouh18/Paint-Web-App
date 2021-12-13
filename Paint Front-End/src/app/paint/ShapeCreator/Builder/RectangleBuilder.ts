import {Builder} from "./Builder";
import Konva from "konva";
import {Rectangle} from "../../Shapes/ConcreteShapes/Rectangle";

export class RectangleBuilder implements Builder {
  Konva: Konva.Rect = new Konva.Rect();
  Shape: any;

  constructor(X = 600, Y = 200, Stroke = "black",
              StrokeWidth = 0, FillColor = "red", Alpha = 1, RotateAngle = 0, Height = 100, Width = 150) {
    this.BuildKonva(X, Y, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle, Height, Width);
    this.BuildShape()
  }

  private BuildKonva(X: number, Y: number, Stroke: string, StrokeWidth: number,
                     FillColor: string, Alpha: number, RotateAngle: number, Height: number, Width: number) {
    this.Konva.setAttrs({
      x: X,
      y: Y,
      fill: FillColor,
      strokeWidth: StrokeWidth,
      draggable: true,
      width: Width,
      height: Height,
      alpha: Alpha,
      rotation: RotateAngle,
      stroke: Stroke,
      name: "shape"
    })
  }

  private BuildShape() {
    this.Shape = new Rectangle(this.Konva._id, this.Konva.x(), this.Konva.y(), this.Konva.stroke(),
      this.Konva.strokeWidth(), this.Konva.fill(), this.Konva.alpha(), this.Konva.rotation(), this.Konva.height(), this.Konva.width());
  }

  GetKonva() {
    return this.Konva;
  }

  GetShape() {
    return this.Shape;
  }
}
