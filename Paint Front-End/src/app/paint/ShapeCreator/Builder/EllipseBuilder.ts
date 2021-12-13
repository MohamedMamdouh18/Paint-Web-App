import {Builder} from "./Builder";
import Konva from "konva";
import {Ellipse} from "../../Shapes/ConcreteShapes/Ellipse";

export class EllipseBuilder implements Builder {
  Konva: Konva.Ellipse = new Konva.Ellipse();
  Shape: any;

  constructor(X = 200, Y = 400, Stroke = "black", StrokeWidth = 0,
              FillColor = "red", Alpha = 1, RotateAngle = 0, RadiusX = 100, RadiusY = 50) {
    this.BuildKonva(X, Y, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle, RadiusX, RadiusY);
    this.BuildShape()
  }

  private BuildKonva(X: number, Y: number, Stroke: string, StrokeWidth: number,
                     FillColor: string, Alpha: number, RotateAngle: number, RadiusX: number, RadiusY: number) {
    this.Konva.setAttrs({
      x: X,
      y: Y,
      fill: FillColor,
      stroke: Stroke,
      strokeWidth: StrokeWidth,
      draggable: true,
      alpha: Alpha,
      rotation: RotateAngle,
      radiusX: RadiusX,
      radiusY: RadiusY,
      name: "shape"
    })
  }

  private BuildShape() {
    this.Shape = new Ellipse(this.Konva._id, this.Konva.x(), this.Konva.y(), this.Konva.stroke(),
      this.Konva.strokeWidth(), this.Konva.fill(), this.Konva.alpha(), this.Konva.rotation(), this.Konva.radiusX(), this.Konva.radiusY());
  }

  GetKonva() {
    return this.Konva;
  }

  GetShape() {
    return this.Shape;
  }
}
