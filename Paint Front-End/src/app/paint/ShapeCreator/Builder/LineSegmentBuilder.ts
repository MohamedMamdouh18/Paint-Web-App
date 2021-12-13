import {Builder} from "./Builder";
import Konva from "konva";
import {LineSegment} from "../../Shapes/ConcreteShapes/LineSegment";

export class LineSegmentBuilder implements Builder {
  Konva: Konva.Line = new Konva.Line;
  Shape: any;

  constructor(X = 200, Y = 200, Stroke = "red", StrokeWidth = 5,
              FillColor = "red", Alpha = 1, RotateAngle = 0, Points = [650, 300, 1100, 300]) {
    this.BuildKonva(X, Y, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle, Points);
    this.BuildShape()
  }

  private BuildKonva(X: number, Y: number, Stroke: string, StrokeWidth: number,
                     FillColor: string, Alpha: number, RotateAngle: number, Points: number[]) {
    this.Konva.setAttrs({
      x: X,
      y: Y,
      fill: FillColor,
      stroke: Stroke,
      strokeWidth: StrokeWidth,
      draggable: true,
      points: Points,
      alpha: Alpha,
      rotation: RotateAngle,
      name: "shape"
    })
  }

  private BuildShape() {
    this.Shape = new LineSegment(this.Konva._id, this.Konva.x(), this.Konva.y(), this.Konva.stroke(),
      this.Konva.strokeWidth(), this.Konva.fill(), this.Konva.alpha(), this.Konva.rotation(), this.Konva.points());
  }

  GetKonva() {
    return this.Konva;
  }

  GetShape() {
    return this.Shape;
  }
}
