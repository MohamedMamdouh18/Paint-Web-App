import {ShapeInter} from "../Interfaces/ShapeInter";

export class Ellipse extends ShapeInter {
  private _RadiusX: number;
  private _RadiusY: number;

  constructor(ID: number, X: number, Y: number, Stroke: string, StrokeWidth: number, FillColor: string,
              Alpha: number, RotateAngle: number, RadiusX: number, RadiusY: number) {
    super(ID, X, Y, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle);
    this._RadiusX = RadiusX;
    this._RadiusY = RadiusY;
    this.Type = "ellipse";
  }

  clone(): ShapeInter {
    return new Ellipse(-1, this.X, this.Y, this.Stroke, this.StrokeWidth,
      this.FillColor, this.Alpha, this.RotateAngle, this._RadiusX, this._RadiusY);
  }

  get RadiusX(): number {
    return this._RadiusX;
  }

  set RadiusX(value: number) {
    this._RadiusX = value;
  }

  get RadiusY(): number {
    return this._RadiusY;
  }

  set RadiusY(value: number) {
    this._RadiusY = value;
  }
}
