import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Result} from "./Result";
import {ApiService} from "./api.service";
import {ShapeInter} from "../paint/Shapes/Interfaces/ShapeInter";
import {Circle} from "../paint/Shapes/ConcreteShapes/Circle";
import {Rectangle} from "../paint/Shapes/ConcreteShapes/Rectangle";
import {Ellipse} from "../paint/Shapes/ConcreteShapes/Ellipse";
import {RegularPolygon} from "../paint/Shapes/ConcreteShapes/RegularPolygon";
import {LineSegment} from "../paint/Shapes/ConcreteShapes/LineSegment";

@Injectable()
export class PaintService {
  constructor(private apiService: ApiService) {
  }

  SendShape(Shape: ShapeInter, Mode: string): Observable<Result> {
    if (Shape instanceof Circle) {
      return this.apiService.ShapePost(Mode, Shape.Type, Shape.ID, {
        "_ID": Shape.ID,
        "_Radius": Shape.Radius,
        "_X": Shape.X,
        "_Y": Shape.Y,
        "_RotateAngle": Shape.RotateAngle,
        "_Stroke": Shape.Stroke,
        "_StrokeWidth": Shape.StrokeWidth,
        "_FillColor": Shape.FillColor,
        "_Alpha": Shape.Alpha
      });
    } else if (Shape instanceof Rectangle) {
      return this.apiService.ShapePost(Mode, Shape.Type, Shape.ID, {
        "_ID": Shape.ID,
        "_Width": Shape.Width,
        "_Height": Shape.Height,
        "_X": Shape.X,
        "_Y": Shape.Y,
        "_RotateAngle": Shape.RotateAngle,
        "_Stroke": Shape.Stroke,
        "_StrokeWidth": Shape.StrokeWidth,
        "_FillColor": Shape.FillColor,
        "_Alpha": Shape.Alpha
      });
    } else if (Shape instanceof RegularPolygon) {
      return this.apiService.ShapePost(Mode, Shape.Type, Shape.ID, {
        "_ID": Shape.ID,
        "_Radius": Shape.Radius,
        "_X": Shape.X,
        "_Y": Shape.Y,
        "_Sides": Shape.Sides,
        "_RotateAngle": Shape.RotateAngle,
        "_Stroke": Shape.Stroke,
        "_StrokeWidth": Shape.StrokeWidth,
        "_FillColor": Shape.FillColor,
        "_Alpha": Shape.Alpha
      });
    } else if (Shape instanceof Ellipse) {
      return this.apiService.ShapePost(Mode, Shape.Type, Shape.ID, {
        "_ID": Shape.ID,
        "_RadiusX": Shape.RadiusX,
        "_RadiusY": Shape.RadiusY,
        "_X": Shape.X,
        "_Y": Shape.Y,
        "_RotateAngle": Shape.RotateAngle,
        "_Stroke": Shape.Stroke,
        "_StrokeWidth": Shape.StrokeWidth,
        "_FillColor": Shape.FillColor,
        "_Alpha": Shape.Alpha
      });
    } else if (Shape instanceof LineSegment) {
      return this.apiService.ShapePost(Mode, Shape.Type, Shape.ID, {
        "_ID": Shape.ID,
        "_Points": Shape.Points,
        "_X": Shape.X,
        "_Y": Shape.Y,
        "_RotateAngle": Shape.RotateAngle,
        "_Stroke": Shape.Stroke,
        "_StrokeWidth": Shape.StrokeWidth,
        "_FillColor": Shape.FillColor,
        "_Alpha": Shape.Alpha
      });
    } else {
      return this.apiService.ShapePost(Mode, Shape.Type, Shape.ID, {
        "_ID": null, "X": null, "Y": null, "_Stroke": null, "_StrokeWidth": null, "_FillColor": null
      });
    }
  }

  save() {
    return this.apiService.SavePost();
  }

  load() {
    return this.apiService.LoadGet();
  }

  UndoMove() {
    return this.apiService.get("undo");
  }

  RedoMove() {
    return this.apiService.get("redo");
  }

  Restart(){
    return this.apiService.Restart();
  }
}
