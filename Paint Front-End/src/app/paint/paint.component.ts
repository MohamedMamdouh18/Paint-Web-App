import {Component, HostListener, OnInit} from '@angular/core';
import {
  faPaintBrush,
  faTrash,
  faSave,
  faFileUpload,
  faUndoAlt,
  faRedoAlt,
  faCopy,
  faPaste,
  faTrashAlt,
  faPalette,
  faMousePointer,
} from '@fortawesome/free-solid-svg-icons';
import Konva from "konva";
import Shape = Konva.Shape;
import {ShapeInter} from "./Shapes/Interfaces/ShapeInter";
import {DefaultDirector} from "./ShapeCreator/Director/DefaultDirector";
import {CloneDirector} from "./ShapeCreator/Director/CloneDirector";
import {SettingsAttr} from "./SettingsUpdate/SettingsAttr";
import {DisabledSettings} from "./SettingsUpdate/DisabledSettings";
import {ShapesCoordinates} from "./ShapesUpdate/ShapesCoordinates";
import {ShapesDimensions} from "./ShapesUpdate/ShapesDimensions";
import {LineSegment} from "./Shapes/ConcreteShapes/LineSegment";
import {PaintService} from "../Service/paint.service";
import {RectangleBuilder} from "./ShapeCreator/Builder/RectangleBuilder";
import {CircleBuilder} from "./ShapeCreator/Builder/CircleBuilder";
import {RegularPolygonBuilder} from "./ShapeCreator/Builder/RegularPolygonBuilder";
import {EllipseBuilder} from "./ShapeCreator/Builder/EllipseBuilder";
import {LineSegmentBuilder} from "./ShapeCreator/Builder/LineSegmentBuilder";
import {Rectangle} from "./Shapes/ConcreteShapes/Rectangle";
import {Circle} from "./Shapes/ConcreteShapes/Circle";
import {RegularPolygon} from "./Shapes/ConcreteShapes/RegularPolygon";
import {Ellipse} from "./Shapes/ConcreteShapes/Ellipse";

@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})
export class PaintComponent implements OnInit {
  constructor(public PaintService: PaintService) {
  }

  createShape: string = "createShape";
  modifyShape: string = "modifyShape";

  DefaultDirector: DefaultDirector = new DefaultDirector();
  CloneDirector: CloneDirector = new CloneDirector();
  Shapes: ShapeInter[] = [];
  ClonedShapes: ShapeInter[] = [];

  CoordinateUpdater: ShapesCoordinates = new ShapesCoordinates();
  DimensionsUpdater: ShapesDimensions = new ShapesDimensions();

  PointerX: number = 0;
  PointerY: number = 0;

  PaletteColor: string = "red";

  faPaintBrush = faPaintBrush;
  faTrash = faTrash;
  faSave = faSave;
  faCopy = faCopy;
  faPaste = faPaste;
  faTrashAlt = faTrashAlt;
  faUpload = faFileUpload;
  faUndoAlt = faUndoAlt;
  faRedoAlt = faRedoAlt;
  faPalette = faPalette;
  faMousePointer = faMousePointer;

  OurSettings: SettingsAttr = new SettingsAttr();
  DisabledSettings: DisabledSettings = new DisabledSettings();

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  tr!: Konva.Transformer;
  selectionShape: Shape = new Konva.Rect({
    fill: 'rgba(255, 255, 255, 0.5)',
    visible: false,
    globalCompositeOperation: "source-over",
  });

  freeDrawingMode: boolean = false;
  isDrawing: boolean = false;
  lastLine: Konva.Line = new Konva.Line({});

  x1: number = 0;
  x2: number = 0;
  y1: number = 0;
  y2: number = 0;

  contextmenu = "none";
  contextmenuX = 0;
  contextmenuY = 0;

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.contextmenuX = event.clientX;
    this.contextmenuY = event.clientY;
    this.contextmenu = "block";
  }

  ngOnInit(): void {
    this.PaintService.Restart().subscribe();

    this.stage = new Konva.Stage({
      container: 'canvas',
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.tr = new Konva.Transformer({
      nodes: [],
      // ignore stroke in size calculations
      ignoreStroke: false,
      // manually adjust size of transformer
      padding: 5,
    });
    this.layer.add(this.tr);
  }

  transform(shape: any) {
    if (!(shape instanceof Konva.Line)) {
      shape.on('transform', () => {
        shape.setAttrs({
          width: Math.max(shape.width() * shape.scaleX(), 5),
          height: Math.max(shape.height() * shape.scaleY(), 5),
          scaleX: 1,
          scaleY: 1,
        });
      });
    }
    if (shape instanceof Konva.Circle || shape instanceof Konva.RegularPolygon) {
      this.tr.setAttrs({
        keepRatio: true,
        enabledAnchors: [
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
        ],
      });
    } else if (shape instanceof Konva.Line) {
      this.tr.setAttrs({
        keepRatio: true,
        enabledAnchors: [
          'middle-right',
          'middle-left',
        ],
      });
    } else {
      this.tr.setAttrs({
        keepRatio: false,
        enabledAnchors: [
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
          'top-center',
          'middle-right',
          'middle-left',
          'bottom-center',
        ],
      });
    }
  }

  copy() {
    this.contextmenu = "none";
    this.PointerY = this.stage.getPointerPosition()!.y;
    this.PointerX = this.stage.getPointerPosition()!.x;

    this.ClonedShapes = [];
    let selectedShapes = this.tr.nodes();
    for (let StageShape of selectedShapes) {
      let ShapesID = this.Shapes.filter(({ID}) => ID === StageShape._id);
      for (let ShapeID of ShapesID) {
        this.ClonedShapes.push(ShapeID.clone());
      }
    }
  }

  paste() {
    this.contextmenu = "none";
    for (let clonedShape of this.ClonedShapes) {
      let x = this.stage.getPointerPosition()!.x;
      let y = this.stage.getPointerPosition()!.y;

      clonedShape.X += x - this.PointerX;
      clonedShape.Y += y - this.PointerY;

      this.CloneDirector.CloneShape(clonedShape);

      this.addShape(this.CloneDirector.GetKonva(), this.CloneDirector.GetShape());
      this.Shapes.push(this.CloneDirector.GetShape());
    }

    this.ClonedShapes = [];
  }

  delete() {
    this.contextmenu = "none";
    let selectedShapes = this.tr.nodes();
    for (let StageShape of selectedShapes) {
      let u = this.Shapes.filter(({ID}) => ID === StageShape._id)[0];
      StageShape.x(2000);
      StageShape.y(2000);
      this.PaintService.SendShape(u, this.modifyShape).subscribe(response => {
        console.log(response.message, response.error);
      });
    }
    this.tr.nodes([]);
  }

  UpdateDesign(key: string) {
    let selectedShapes = this.tr.nodes();
    for (let StageShape of selectedShapes) {
      for (let shape of this.Shapes) {
        if (shape.ID == StageShape._id) {
          if (shape instanceof LineSegment) {
            this.OurSettings.FillColour = "";
          } else if (shape.FillColor == this.OurSettings.FillColour) {
            shape.FillColor = this.OurSettings.FillColour = this.PaletteColor;
            if (shape.FillColor.includes("rgba")) {
              this.OurSettings.alpha = Number(shape.FillColor.split(",")[3].split(")")[0]);
            }
          } else if (shape.FillColor == this.PaletteColor) {
            shape.FillColor = this.PaletteColor = this.OurSettings.FillColour;
          }

          shape.StrokeWidth = Number(this.OurSettings.StrokeThickness);
          shape.Stroke = this.OurSettings.StrokeColor;
          StageShape.setAttrs({
            fill: this.OurSettings.FillColour,
            strokeWidth: shape.StrokeWidth,
            stroke: this.OurSettings.StrokeColor,
            draggable: true,
            opacity: Number(this.OurSettings.alpha),
          });
          if (key == 'pickerclose') {
            this.PaintService.SendShape(shape, this.modifyShape).subscribe(response => {
              console.log(response.message, response.error);
            });
          }
        }
      }
    }
  }

  clickSelect() {
    //this.DimensionsUpdater.OnResizing(this.tr, this.Shapes, this.OurSettings, this.PaintService);
    if (this.tr.nodes().length == 1) this.transform(this.tr.nodes()[0]);
    this.stage.on('click', (e) => {
      if (this.freeDrawingMode) return;

      // if we are selecting with rect, do nothing
      if (this.selectionShape.visible()) return;

      // if click on empty area - remove all selections
      if (e.target === this.stage) {
        this.tr.nodes([]);
        return;
      }

      // do nothing if clicked NOT on our rectangles
      if (!e.target.hasName('shape')) {
        return;
      }

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = this.tr.nodes().indexOf(e.target) >= 0;

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        this.tr.nodes([e.target]);
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = this.tr.nodes().concat([e.target]);
        this.tr.nodes(nodes);
      }
    });
  }

  boxSelect() {
    this.layer.add(this.selectionShape);
    this.stage.on('mousedown', (e) => {
      if (this.freeDrawingMode) return;
      if (e.target !== this.stage) return;
      e.evt.preventDefault();

      this.x1 = this.stage.getPointerPosition()!.x;
      this.y1 = this.stage.getPointerPosition()!.y;
      this.x2 = this.stage.getPointerPosition()!.x;
      this.y2 = this.stage.getPointerPosition()!.y;

      this.selectionShape.visible(true);
      this.selectionShape.width(0);
      this.selectionShape.height(0);
    });

    this.stage.on('mousemove', (e) => {
      if (this.freeDrawingMode) return;
      if (!this.selectionShape.visible()) return;
      e.evt.preventDefault();

      this.x2 = this.stage.getPointerPosition()!.x;
      this.y2 = this.stage.getPointerPosition()!.y;

      this.selectionShape.setAttrs({
        x: Math.min(this.x1, this.x2),
        y: Math.min(this.y1, this.y2),
        width: Math.abs(this.x2 - this.x1),
        height: Math.abs(this.y2 - this.y1),
      });
    });

    this.stage.on('mouseup', (e) => {
      if (this.freeDrawingMode) return;
      if (!this.selectionShape.visible()) return;
      e.evt.preventDefault();

      setTimeout(() => {
        this.selectionShape.visible(false);
      });

      let shapes = this.stage.find(".shape");
      let selectionArea = this.selectionShape.getClientRect();
      let selectedShapes = shapes.filter((shape) =>
        Konva.Util.haveIntersection(selectionArea, shape.getClientRect())
      );
      this.tr.nodes(selectedShapes);
      this.selectionShape.remove();
    });
  }

  @HostListener('window:keydown.Control.z', ['$event']) cz() {
    this.undo();
  }

  @HostListener('window:keydown.Control.y', ['$event']) cy() {
    this.redo();
  }

  @HostListener('window:keydown.Control.Shift.z', ['$event']) csz() {
    this.redo();
  }

  @HostListener('window:keydown.Control.c', ['$event']) cc() {
    this.copy();
  }

  @HostListener('window:keydown.Control.v', ['$event']) cv() {
    this.paste();
  }

  @HostListener('window:keydown.Delete', ['$event']) del() {
    this.delete();
  }

  @HostListener('window:keydown.p', ['$event']) p() {
    this.freeDrawingMode = true;
  }

  @HostListener('window:keydown.v', ['$event']) d() {
    this.freeDrawingMode = false;
  }

  @HostListener('window:keydown.s', ['$event']) s() {
    this.square();
  }

  @HostListener('window:keydown.r', ['$event']) r() {
    this.rect();
  }

  @HostListener('window:keydown.h', ['$event']) h() {
    this.hexagon();
  }

  @HostListener('window:keydown.g', ['$event']) pent() {
    this.pentagon();
  }

  @HostListener('window:keydown.c', ['$event']) cir() {
    this.circle();
  }

  @HostListener('window:keydown.e', ['$event']) e() {
    this.ellipse();
  }

  @HostListener('window:keydown.t', ['$event']) t() {
    this.triangle();
  }

  @HostListener('window:keydown.i', ['$event']) l() {
    this.lineSegment();
  }

  @HostListener('window:keydown.Control.s', ['$event']) cs(e: any) {
    e.preventDefault();
    this.save();
  }

  @HostListener('window:keydown.Control.a', ['$event']) all(e: any) {
    e.preventDefault();
    let shapes = this.stage.find(".shape");
    let inShapes = shapes.filter((shape) => shape.x() !== 2000);
    this.tr.nodes(inShapes);
    if (this.tr.nodes().length > 1) {
      this.tr.setAttrs({
        keepRatio: true,
        enabledAnchors: [
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
        ],
      });
    }
  }

  @HostListener('window:keydown.l', ['$event']) cl(e: any) {
    e.preventDefault();
    this.load();
  }

  Settings() {
    if (this.tr.nodes().length == 1) {
      let shape = this.tr.nodes()[0];
      if (shape instanceof Konva.Circle || shape instanceof Konva.RegularPolygon) {
        this.DisabledSettings.CircleAndPolygon();

      } else if (shape instanceof Konva.Rect) {
        this.DisabledSettings.Rect();

      } else if (shape instanceof Konva.Ellipse) {
        this.DisabledSettings.Ellipse();
      }
    } else {
      this.DisabledSettings.MoreThanShape();
    }
  }

  SelectorType() {
    this.stage.on("dragstart", (e) => {
      if (this.tr.nodes().length > 1 || this.freeDrawingMode) return;
      this.tr.nodes([e.target]);
    });
    this.stage.on("dragend", () => {
      if (this.freeDrawingMode) return;
      this.CoordinateUpdater.UpdateShapesCoordinates(this.tr, this.Shapes, this.PaintService);
    });
    if (this.tr.nodes().length == 1) {
      let SelectedShape = this.tr.nodes()[0] as Konva.Shape;
      let Shape = this.Shapes.filter(({ID}) => ID === SelectedShape._id)[0];
      this.PaletteColor = SelectedShape.fill();
      this.OurSettings.UpdateOnClick(SelectedShape);
      this.tr.nodes()[0].on("transformend", () => {
        if (this.freeDrawingMode) return;
        let x = Shape.X;
        let y = Shape.Y;
        this.DimensionsUpdater.OnResizing(this.tr, this.Shapes, this.OurSettings, this.PaintService);
        if (Math.abs(x - this.tr.nodes()[0].x()) > 0.1 || Math.abs(y - this.tr.nodes()[0].y()) > 0.1) {
          this.CoordinateUpdater.UpdateShapesCoordinates(this.tr, this.Shapes, this.PaintService);
        }
      });
    }
    this.contextmenu = "none";
    if (this.freeDrawingMode) this.freeDrawing();
    if (this.freeDrawingMode) return;
    this.boxSelect();
    this.clickSelect();
    this.Settings();
    if (this.tr.nodes().length > 1) {
      this.tr.setAttrs({
        keepRatio: true,
        enabledAnchors: [
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
        ],
      });
    }
  }

  Repeat(y: any) {
    let z;
    this.Shapes = this.Shapes.filter(({ID}) => ID !== y.key);
    if (y.value._Type == "rectangle") {
      z = new RectangleBuilder(y.value._X, y.value._Y, y.value._Stroke, y.value._StrokeWidth,
        y.value._FillColor, y.value._Alpha, y.value._RotateAngle,
        y.value._Height, y.value._Width);
      this.addShape(z.GetKonva(), z.GetShape());
      this.Shapes.push(z.GetShape());
    } else if (y.value._Type == "circle") {
      z = new CircleBuilder(y.value._X, y.value._Y, y.value._Stroke, y.value._StrokeWidth,
        y.value._FillColor, y.value._Alpha, y.value._RotateAngle, y.value._Radius);
      this.addShape(z.GetKonva(), z.GetShape());
      this.Shapes.push(z.GetShape());
    } else if (y.value._Type == "polygon") {
      z = new RegularPolygonBuilder(y.value._Sides, y.value._X, y.value._Y, y.value._Stroke, y.value._StrokeWidth,
        y.value._FillColor, y.value._Alpha, y.value._RotateAngle,
        y.value._Radius);
      this.addShape(z.GetKonva(), z.GetShape());
      this.Shapes.push(z.GetShape());
    } else if (y.value._Type == "ellipse") {
      z = new EllipseBuilder(y.value._X, y.value._Y, y.value._Stroke, y.value._StrokeWidth,
        y.value._FillColor, y.value._Alpha, y.value._RotateAngle,
        y.value._RadiusX, y.value._RadiusY);
      this.addShape(z.GetKonva(), z.GetShape());
      this.Shapes.push(z.GetShape());
    } else if (y.value._Type == "linesegment") {
      z = new LineSegmentBuilder(y.value._X, y.value._Y, y.value._Stroke, y.value._StrokeWidth,
        y.value._FillColor, y.value._Alpha, y.value._RotateAngle,
        y.value._Points);
      this.addShape(z.GetKonva(), z.GetShape());
      this.Shapes.push(z.GetShape());
    }
  }

  LoadRepeat(y: any) {
    let z;
    this.Shapes = this.Shapes.filter(({ID}) => ID !== y.key);
    if (y._Type == "rectangle") {
      z = new RectangleBuilder(y._X, y._Y, y._Stroke, y._StrokeWidth,
        y._FillColor, y._Alpha, y._RotateAngle,
        y._Height, y._Width);
      this.addShape(z.GetKonva(), z.GetShape());
      this.Shapes.push(z.GetShape());
    } else if (y._Type == "circle") {
      z = new CircleBuilder(y._X, y._Y, y._Stroke, y._StrokeWidth,
        y._FillColor, y._Alpha, y._RotateAngle, y._Radius);
      this.addShape(z.GetKonva(), z.GetShape());
      this.Shapes.push(z.GetShape());
    } else if (y._Type == "polygon") {
      z = new RegularPolygonBuilder(y._Sides, y._X, y._Y, y._Stroke, y._StrokeWidth,
        y._FillColor, y._Alpha, y._RotateAngle,
        y._Radius);
      this.addShape(z.GetKonva(), z.GetShape());
      this.Shapes.push(z.GetShape());
    } else if (y._Type == "ellipse") {
      z = new EllipseBuilder(y._X, y._Y, y._Stroke, y._StrokeWidth,
        y._FillColor, y._Alpha, y._RotateAngle,
        y._RadiusX, y._RadiusY);
      this.addShape(z.GetKonva(), z.GetShape());
      this.Shapes.push(z.GetShape());
    } else if (y._Type == "linesegment") {
      z = new LineSegmentBuilder(y._X, y._Y, y._Stroke, y._StrokeWidth,
        y._FillColor, y._Alpha, y._RotateAngle,
        y._Points);
      this.addShape(z.GetKonva(), z.GetShape());
      this.Shapes.push(z.GetShape());
    }
  }

  Repeat3(y: any) {
    let u = this.stage.find(".shape").filter(({_id}) => _id === y.key)[0];
    this.Shapes = this.Shapes.filter(({ID}) => ID !== y.key);
    if (u instanceof Konva.Shape) {
      u.x(y.value._X);
      u.y(y.value._Y);
      u.stroke(y.value._Stroke);
      u.fill(y.value._FillColor);
      u.strokeWidth(y.value._StrokeWidth);
      u.alpha(y.value._Alpha);
      u.rotation(y.value._RotateAngle);
    }
    if (y.value._Type == "rectangle" && u instanceof Konva.Rect) {
      u.width(y.value._Width);
      u.height(y.value._Height);
      this.Shapes.push(new Rectangle(u._id, u.x(), u.y(), u.stroke(), u.strokeWidth(),
        u.fill(), u.alpha(), u.rotation(), u.height(), u.width()));
    } else if (y.value._Type == "polygon" && u instanceof Konva.RegularPolygon) {
      u.radius(y.value._Radius);
      this.Shapes.push(new RegularPolygon(u._id, u.x(), u.y(), u.stroke(), u.strokeWidth(),
        u.fill(), u.alpha(), u.rotation(), u.radius(), u.sides()));
    } else if (y.value._Type == "circle" && u instanceof Konva.Circle) {
      u.radius(y.value._Radius);
      this.Shapes.push(new Circle(u._id, u.x(), u.y(), u.stroke(), u.strokeWidth(),
        u.fill(), u.alpha(), u.rotation(), u.radius()));
    } else if (y.value._Type == "ellipse" && u instanceof Konva.Ellipse) {
      u.radiusY(y.value._RadiusY);
      u.radiusX(y.value._RadiusX);
      this.Shapes.push(new Ellipse(u._id, u.x(), u.y(), u.stroke(), u.strokeWidth(),
        u.fill(), u.alpha(), u.rotation(), u.radiusX(), u.radiusY()));
    } else if (y.value._Type == "linesegment" && u instanceof Konva.Line) {
      u.points(y.value._Points);
      this.Shapes.push(new LineSegment(u._id, u.x(), u.y(), u.stroke(), u.strokeWidth(),
        u.fill(), u.alpha(), u.rotation(), u.points()));
    }
  }

  Repeat2(y: any, child: any) {
    child.y(y.value._Y);
    child.x(y.value._X);
    child.rotation(y.value._RotateAngle);
    if (child instanceof Konva.Circle || child instanceof Konva.RegularPolygon) child.radius(y.value._Radius);
    else if (child instanceof Konva.Line) child.points(y.value._Points);
    else if (child instanceof Konva.Rect) {
      child.width(y.value._Width);
      child.height(y.value._Height);
    }
    if (child instanceof Konva.Shape) {
      child.fill(y.value._FillColor);
      child.strokeWidth(y.value._StrokeWidth);
      child.stroke(y.value._Stroke);
    }
  }

  undo() {
    this.PaintService.UndoMove().subscribe(response => {
      let x = JSON.stringify(response);
      let y = JSON.parse(x);
      if (!y.value) {
        for (let child of this.layer.children!) {
          if (y.key == child._id) {
            child.x(2000);
            child.y(2000);
          }
        }
        for (let shape of this.Shapes) {
          if (y.key == shape.ID) {
            this.Shapes = this.Shapes.filter(({ID}) => ID !== shape.ID);
          }
        }
        this.tr.nodes([]);
      } else if (y.value) {
        for (let child of this.layer.children!) {
          if (y.key == child._id) {
            this.Repeat2(y, child);
            this.Repeat3(y);
          }
        }
      }
    }, () => {
      console.log("Error");
    });
  }

  redo() {
    let y;
    this.PaintService.RedoMove().subscribe(response => {
      let x = JSON.stringify(response);
      y = JSON.parse(x);
      for (let child of this.layer.children!) {
        if (y.value._ID == child._id) {
          this.Repeat2(y, child);
          this.Repeat3(y);
          return;
        }
      }
      for (let child of this.layer.children!) {
        if (y.value._ID != child._id) {
          this.Repeat(y);
          return;
        }
      }
    }, () => {
      console.log("Error");
    });
  }

  save() {
    this.PaintService.save().subscribe();
  }

  load() {
    this.layer.destroy();
    this.stage.remove();
    this.ngOnInit();
    this.Shapes = [];
    let y;
    this.PaintService.load().subscribe(response => {
      let x = JSON.stringify(response);
      y = JSON.parse(x);
      for (let yElement of y) {
        this.LoadRepeat(yElement);
      }
    });
    this.PaintService.Restart().subscribe();
  }

  addShape(konvaShape: Shape, shape: ShapeInter) {
    this.layer.add(konvaShape);
    this.stage.add(this.layer);
    this.PaintService.SendShape(shape, this.createShape).subscribe(response => {
      console.log(response.message, response.error);
    });
  }

  circle() {
    this.freeDrawingMode = false;
    this.DefaultDirector.constructCircle();
    this.addShape(this.DefaultDirector.GetKonva(), this.DefaultDirector.GetShape());
    this.Shapes.push(this.DefaultDirector.GetShape());
  }

  ellipse() {
    this.freeDrawingMode = false;
    this.DefaultDirector.constructEllipse();
    this.addShape(this.DefaultDirector.GetKonva(), this.DefaultDirector.GetShape());
    this.Shapes.push(this.DefaultDirector.GetShape());
  }

  square() {
    this.freeDrawingMode = false;
    this.DefaultDirector.constructSquare();
    this.addShape(this.DefaultDirector.GetKonva(), this.DefaultDirector.GetShape());
    this.Shapes.push(this.DefaultDirector.GetShape());
  }

  rect() {
    this.freeDrawingMode = false;
    this.DefaultDirector.constructRectangle();
    this.addShape(this.DefaultDirector.GetKonva(), this.DefaultDirector.GetShape());
    this.Shapes.push(this.DefaultDirector.GetShape());
  }

  hexagon() {
    this.freeDrawingMode = false;
    this.DefaultDirector.constructPolygon(6, 400, 450);
    this.addShape(this.DefaultDirector.GetKonva(), this.DefaultDirector.GetShape());
    this.Shapes.push(this.DefaultDirector.GetShape());
  }

  pentagon() {
    this.freeDrawingMode = false;
    this.DefaultDirector.constructPolygon(5, 600, 450);
    this.addShape(this.DefaultDirector.GetKonva(), this.DefaultDirector.GetShape());
    this.Shapes.push(this.DefaultDirector.GetShape());
  }

  triangle() {
    this.freeDrawingMode = false;
    this.DefaultDirector.constructPolygon(3, 800, 450);
    this.addShape(this.DefaultDirector.GetKonva(), this.DefaultDirector.GetShape());
    this.Shapes.push(this.DefaultDirector.GetShape());
  }

  lineSegment() {
    this.freeDrawingMode = false;
    this.DefaultDirector.constructLine();
    this.addShape(this.DefaultDirector.GetKonva(), this.DefaultDirector.GetShape());
    this.Shapes.push(this.DefaultDirector.GetShape());
  }

  freeDrawing() {
    let mode = 'brush';
    this.stage.on('mousedown', () => {
      if (!this.freeDrawingMode) return;
      this.isDrawing = true;
      this.lastLine = new Konva.Line({
        stroke: '#e3d8d3',
        strokeWidth: 5,
        globalCompositeOperation:
          mode === 'brush' ? 'source-over' : 'destination-out',
        // round cap for smoother lines
        lineCap: 'round',
        // add point twice, so we have some drawings even on a simple click
        points: [],
        name: 'shape',
        draggable: false,
      });
      this.layer.add(this.lastLine);
    });

    this.stage.on('mouseup', () => {
      if (!this.freeDrawingMode) return;
      this.isDrawing = false;
      this.tr.nodes([]);
    });

    this.stage.on('mousemove', (e) => {
      if (!this.freeDrawingMode) return;
      if (!this.isDrawing) return;
      // prevent scrolling on touch devices
      e.evt.preventDefault();

      const pos = this.stage.getPointerPosition();
      let newPoints = this.lastLine.points().concat([pos!.x, pos!.y]);
      this.lastLine.points(newPoints);
    });
    this.addShape(this.lastLine, new LineSegment(this.lastLine._id, this.lastLine.points()[0],
      this.lastLine.points()[1], this.lastLine.stroke(), this.lastLine.strokeWidth(), this.lastLine.fill(),
      this.lastLine.alpha(), this.lastLine.rotation(), this.lastLine.points()));
    this.Shapes.push(new LineSegment(this.lastLine._id, this.lastLine.points()[0], this.lastLine.points()[1],
      this.lastLine.stroke(), this.lastLine.strokeWidth(), this.lastLine.fill(),
      this.lastLine.alpha(), this.lastLine.rotation(), this.lastLine.points()))
  }
}
