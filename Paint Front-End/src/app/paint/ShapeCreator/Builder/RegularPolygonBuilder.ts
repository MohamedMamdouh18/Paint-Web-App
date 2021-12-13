import {Builder} from "./Builder";
import Konva from "konva";
import {RegularPolygon} from "../../Shapes/ConcreteShapes/RegularPolygon";

export class RegularPolygonBuilder implements Builder {
  Konva: Konva.RegularPolygon = new Konva.RegularPolygon();
  Shape: any;

  constructor(Sides: number, X: number, Y: number, Stroke = "black", StrokeWidth = 0,
              FillColor = "red", Alpha = 1, RotateAngle = 0, Radius = 100) {
    this.BuildKonva(Sides, X, Y, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle, Radius);
    this.BuildShape()
  }

  private BuildKonva(Sides: number, X: number, Y: number, Stroke: string, StrokeWidth: number,
                     FillColor: string, Alpha: number, RotateAngle: number, Radius: number) {
    this.Konva.setAttrs({
      x: X,
      y: Y,
      sides: Sides,
      radius: Radius,
      fill: FillColor,
      stroke: Stroke,
      draggable: true,
      alpha: Alpha,
      rotation: RotateAngle,
      strokeWidth: StrokeWidth,
      name: "shape"
    })
  }

  private BuildShape() {
    this.Shape = new RegularPolygon(this.Konva._id, this.Konva.x(), this.Konva.y(), this.Konva.stroke(),
      this.Konva.strokeWidth(), this.Konva.fill(), this.Konva.alpha(), this.Konva.rotation(), this.Konva.radius(), this.Konva.sides());
  }

  GetKonva() {
    return this.Konva;
  }

  GetShape() {
    return this.Shape;
  }
}
