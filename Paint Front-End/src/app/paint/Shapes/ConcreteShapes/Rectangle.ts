import {ShapeInter} from "../Interfaces/ShapeInter";

export class Rectangle extends ShapeInter {
  private _Width: number;
  private _Height: number;

  constructor(ID: number, X: number, Y: number, Stroke: string, StrokeWidth: number, FillColor: string, Alpha: number, RotateAngle: number,
              Height: number, Width: number) {
    super(ID, X, Y, Stroke, StrokeWidth, FillColor, Alpha, RotateAngle);
    this.Type = "rectangle";
    this._Width = Width;
    this._Height = Height;
  }

  clone(): ShapeInter {
    return new Rectangle(-1, this.X, this.Y, this.Stroke,
      this.StrokeWidth, this.FillColor, this.Alpha, this.RotateAngle, this._Height, this._Width);
  }

  get Width(): number {
    return this._Width;
  }

  set Width(value: number) {
    this._Width = value;
  }

  get Height(): number {
    return this._Height;
  }

  set Height(value: number) {
    this._Height = value;
  }
}
