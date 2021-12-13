import {Builder} from "./Builder";
import {Circle} from "../../Shapes/ConcreteShapes/Circle";
import Konva from "konva";

export class CircleBuilder implements Builder {
  Konva: Konva.Circle = new Konva.Circle;
  Shape: any;

  constructor(X = 200, Y = 200, Stroke = "black",
              StrokeWidth = 0, FillColor = "red", Alpha = 1, RotateAngle = 0, Radius = 100) {
    this.BuildKonva(X, Y, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle, Radius);
    this.BuildShape()
  }

  private BuildKonva(X: number, Y: number, Stroke: string,
                     StrokeWidth: number, FillColor: string, Alpha: number, RotateAngle: number, Radius: number) {
    this.Konva.setAttrs({
      x: X,
      y: Y,
      fill: FillColor,
      stroke: Stroke,
      strokeWidth: StrokeWidth,
      draggable: true,
      radius: Radius,
      alpha: Alpha,
      rotation: RotateAngle,
      name: "shape"
    })
  }

  private BuildShape() {
    this.Shape = new Circle(this.Konva._id, this.Konva.x(), this.Konva.y(), this.Konva.stroke(),
      this.Konva.strokeWidth(), this.Konva.fill(), this.Konva.alpha(), this.Konva.rotation(), this.Konva.radius());
  }

  GetKonva() {
    return this.Konva;
  }

  GetShape() {
    return this.Shape;
  }
}
