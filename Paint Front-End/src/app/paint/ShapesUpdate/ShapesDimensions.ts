import Konva from "konva";
import {ShapeInter} from "../Shapes/Interfaces/ShapeInter";
import {SettingsAttr} from "../SettingsUpdate/SettingsAttr";
import {Ellipse} from "../Shapes/ConcreteShapes/Ellipse";
import {Circle} from "../Shapes/ConcreteShapes/Circle";
import {Rectangle} from "../Shapes/ConcreteShapes/Rectangle";
import {RegularPolygon} from "../Shapes/ConcreteShapes/RegularPolygon";
import {PaintService} from "../../Service/paint.service";

export class ShapesDimensions {
  modifyShape: string = "modifyShape";
  OnResizing(tr: Konva.Transformer, Shapes: ShapeInter[], Settings: SettingsAttr, PaintService: PaintService) {
    let selectedShapes = tr.nodes();
    for (let StageShape of selectedShapes) {
      for (let shape of Shapes) {
        if (shape.ID == StageShape._id) {
          shape.RotateAngle = StageShape.rotation();
          if (shape instanceof Ellipse && StageShape instanceof Konva.Ellipse) {
            Settings.radiusX = shape.RadiusX = StageShape.radiusX();
            Settings.radiusY = shape.RadiusY = StageShape.radiusY();

          } else if ((shape instanceof Circle || shape instanceof RegularPolygon)
            && (StageShape instanceof Konva.Circle || StageShape instanceof Konva.RegularPolygon)) {
            Settings.circlePolygonRadius = shape.Radius = (StageShape.radius());

          } else if (shape instanceof Rectangle && StageShape instanceof Konva.Rect) {

            Settings.width = shape.Width = StageShape.width();
            Settings.height = shape.Height = StageShape.height();
          }
          PaintService.SendShape(shape, this.modifyShape).subscribe(response => {
            console.log(response.message, response.error);
          });
        }
      }
    }
  }

  OnTyping(tr: Konva.Transformer, Shapes: ShapeInter[], Settings: SettingsAttr, PaintService: PaintService) {
    let selectedShapes = tr.nodes();
    for (let StageShape of selectedShapes) {
      for (let shape of Shapes) {
        if (shape.ID == StageShape._id) {
          if (shape instanceof Ellipse && StageShape instanceof Konva.Ellipse) {

            shape.RadiusX = Settings.radiusX;
            shape.RadiusY = Settings.radiusY;
            StageShape.radiusX(shape.RadiusX);
            StageShape.radiusY(shape.RadiusY);

          } else if ((shape instanceof Circle || shape instanceof RegularPolygon)
            && (StageShape instanceof Konva.Circle || StageShape instanceof Konva.RegularPolygon)) {

            shape.Radius = Settings.circlePolygonRadius;
            StageShape.radius(shape.Radius);

          } else if (shape instanceof Rectangle && StageShape instanceof Konva.Rect) {

            shape.Height = Settings.height;
            shape.Width = Settings.width;
            StageShape.height(shape.Height);
            StageShape.width(shape.Width);
          }
          PaintService.SendShape(shape, this.modifyShape).subscribe(response => {
            console.log(response.message, response.error);
          });
        }
      }
    }
  }
}
