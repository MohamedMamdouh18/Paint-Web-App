import Konva from "konva";
import {ShapeInter} from "../Shapes/Interfaces/ShapeInter";
import {PaintService} from "../../Service/paint.service";

export class ShapesCoordinates {
  modifyShape: string = "modifyShape";
  UpdateShapesCoordinates(tr: Konva.Transformer, Shapes: ShapeInter[], PaintService: PaintService) {
    let selectedShapes = tr.nodes();
    for (let StageShape of selectedShapes) {
      for (let shape of Shapes) {
        if (shape.ID == StageShape._id) {
          if (Math.abs(shape.X - Math.round(StageShape.x())) > 0.1 ||
            Math.abs(shape.Y - Math.round(StageShape.y())) > 0.1) {
          } else return;
          shape.X = Math.round(StageShape.x());
          shape.Y = Math.round(StageShape.y());
          PaintService.SendShape(shape, this.modifyShape).subscribe(response => {
            console.log(response.message, response.error);
          });
        }
      }
    }
  }

}
