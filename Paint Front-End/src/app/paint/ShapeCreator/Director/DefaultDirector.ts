import {CircleBuilder} from "../Builder/CircleBuilder";
import {EllipseBuilder} from "../Builder/EllipseBuilder";
import {RectangleBuilder} from "../Builder/RectangleBuilder";
import {ShapeDirector} from "./ShapeDirector";
import {LineSegmentBuilder} from "../Builder/LineSegmentBuilder";
import {RegularPolygonBuilder} from "../Builder/RegularPolygonBuilder";

export class DefaultDirector extends ShapeDirector {
  public constructCircle() {
    this.smallBuilder = new CircleBuilder();
  }

  public constructEllipse() {
    this.smallBuilder = new EllipseBuilder();
  }

  public constructPolygon(Sides: number, X: number, Y: number) {
    this.smallBuilder = new RegularPolygonBuilder(Sides, X, Y);
  }

  public constructRectangle() {
    this.smallBuilder = new RectangleBuilder();
  }

  public constructLine() {
    this.smallBuilder = new LineSegmentBuilder();
  }

  public constructSquare() {
    this.smallBuilder = new RectangleBuilder(400, 200, "black",
      0, "red", 1, 0, 100, 100);
  }
}
