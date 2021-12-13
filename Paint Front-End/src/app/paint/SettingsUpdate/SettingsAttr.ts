import Konva from "konva";

export class SettingsAttr {
  private _radiusX: number = 100;
  private _radiusY: number = 50;
  private _width: number = 150;
  private _height: number = 100;
  private _circlePolygonRadius: number = 100;
  private _StrokeThickness: number = 0;
  private _FillColour: string = "#ff0000";
  private _StrokeColor: string = "#ff0000";
  private _alpha: number = 1;

  UpdateOnClick(Shape: Konva.Shape) {
    if (Shape instanceof Konva.Line) this.FillColour = "none";
    else this.FillColour = Shape.fill();
    this.StrokeColor = Shape.stroke();
    this.StrokeThickness = Shape.strokeWidth();
    this.alpha = Shape.alpha();
  }

  get radiusX(): number {
    return this._radiusX;
  }

  set radiusX(value: number) {
    this._radiusX = Math.round(value * 100) / 100;
  }

  get radiusY(): number {
    return this._radiusY;
  }

  set radiusY(value: number) {
    this._radiusY = Math.round(value * 100) / 100;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = Math.round(value * 100) / 100;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = Math.round(value * 100) / 100;
  }

  get circlePolygonRadius(): number {
    return this._circlePolygonRadius;
  }

  set circlePolygonRadius(value: number) {
    this._circlePolygonRadius = Math.round(value * 100) / 100;
  }

  get StrokeThickness(): number {
    return this._StrokeThickness;
  }

  set StrokeThickness(value: number) {
    this._StrokeThickness = value;
  }

  get FillColour(): string {
    return this._FillColour;
  }

  set FillColour(value: string) {
    this._FillColour = value;
  }

  get StrokeColor(): string {
    return this._StrokeColor;
  }

  set StrokeColor(value: string) {
    this._StrokeColor = value;
  }

  get alpha(): number {
    return this._alpha;
  }

  set alpha(value: number) {
    this._alpha = value;
  }
}
