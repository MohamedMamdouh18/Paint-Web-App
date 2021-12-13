import {CircleBuilder} from "../Builder/CircleBuilder";
import {EllipseBuilder} from "../Builder/EllipseBuilder";
import {RectangleBuilder} from "../Builder/RectangleBuilder";
import {Circle} from "../../Shapes/ConcreteShapes/Circle";
import {Rectangle} from "../../Shapes/ConcreteShapes/Rectangle";
import {Ellipse} from "../../Shapes/ConcreteShapes/Ellipse";
import {ShapeDirector} from "./ShapeDirector";
import {ShapeInter} from "../../Shapes/Interfaces/ShapeInter";
import {RegularPolygonBuilder} from "../Builder/RegularPolygonBuilder";
import {RegularPolygon} from "../../Shapes/ConcreteShapes/RegularPolygon";
import {LineSegment} from "../../Shapes/ConcreteShapes/LineSegment";
import {LineSegmentBuilder} from "../Builder/LineSegmentBuilder";

export class CloneDirector extends ShapeDirector {

  public CloneShape(CloneShape: ShapeInter) {
    if (CloneShape instanceof Circle) {
      this.smallBuilder = new CircleBuilder(CloneShape.X, CloneShape.Y, CloneShape.Stroke,
        CloneShape.StrokeWidth, CloneShape.FillColor, CloneShape.Alpha, CloneShape.RotateAngle, CloneShape.Radius);
    } else if (CloneShape instanceof Rectangle) {
      this.smallBuilder = new RectangleBuilder(CloneShape.X, CloneShape.Y, CloneShape.Stroke,
        CloneShape.StrokeWidth, CloneShape.FillColor, CloneShape.Alpha, CloneShape.RotateAngle, CloneShape.Height, CloneShape.Width);
    } else if (CloneShape instanceof Ellipse) {
      this.smallBuilder = new EllipseBuilder(CloneShape.X, CloneShape.Y, CloneShape.Stroke,
        CloneShape.StrokeWidth, CloneShape.FillColor, CloneShape.Alpha, CloneShape.RotateAngle, CloneShape.RadiusX, CloneShape.RadiusY);
    } else if (CloneShape instanceof RegularPolygon) {
      this.smallBuilder = new RegularPolygonBuilder(CloneShape.Sides, CloneShape.X, CloneShape.Y, CloneShape.Stroke,
        CloneShape.StrokeWidth, CloneShape.FillColor, CloneShape.Alpha, CloneShape.RotateAngle, CloneShape.Radius);
    } else if (CloneShape instanceof LineSegment) {
      this.smallBuilder = new LineSegmentBuilder(CloneShape.X, CloneShape.Y, CloneShape.Stroke,
        CloneShape.StrokeWidth, CloneShape.FillColor, CloneShape.Alpha, CloneShape.RotateAngle, CloneShape.Points);
    }
  }

}
