import {ShapeInter} from "../Interfaces/ShapeInter";

export class LineSegment extends ShapeInter {
  private _Points: number[];

  constructor(ID: number, X: number, Y: number, Stroke: string, StrokeWidth: number,
              FillColor: string, Alpha: number, RotateAngle: number, points: number[]) {
    super(ID, X, Y, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle);
    this._Points = points;
    this.Type = "linesegment";
  }

  clone(): ShapeInter {
    return new LineSegment(-1, this.X, this.Y, this.Stroke, this.StrokeWidth,
      this.FillColor, this.Alpha, this.RotateAngle, this.Points);
  }

  get Points(): number[] {
    return this._Points;
  }

  set Points(value: number[]) {
    this._Points = value;
  }
}
