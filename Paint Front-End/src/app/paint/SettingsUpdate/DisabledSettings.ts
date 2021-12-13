export class DisabledSettings {
  private _CirclePolygon: string = "none";
  private _rectangular: string = "none";
  private _radXY: string = "none";

  CircleAndPolygon() {
    this.CirclePolygon = "block";
    this.rectangular = "none";
    this.radXY = "none";
  }

  Rect() {
    this.rectangular = "block";
    this.CirclePolygon = "none";
    this.radXY = "none";
  }

  Ellipse() {
    this.radXY = "block";
    this.rectangular = "none";
    this.CirclePolygon = "none";
  }

  MoreThanShape() {
    this.rectangular = "none";
    this.CirclePolygon = "none";
    this.radXY = "none";
  }

  get CirclePolygon(): string {
    return this._CirclePolygon;
  }

  set CirclePolygon(value: string) {
    this._CirclePolygon = value;
  }

  get rectangular(): string {
    return this._rectangular;
  }

  set rectangular(value: string) {
    this._rectangular = value;
  }

  get radXY(): string {
    return this._radXY;
  }

  set radXY(value: string) {
    this._radXY = value;
  }
}
