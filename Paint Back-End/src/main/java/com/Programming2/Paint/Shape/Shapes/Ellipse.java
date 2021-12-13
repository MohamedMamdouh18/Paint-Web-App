package com.Programming2.Paint.Shape.Shapes;

public class Ellipse implements IShape {
    private float _X, _Y, _RadiusX, _RadiusY, _StrokeWidth, _Alpha, _RotateAngle;
    private String _Stroke, _FillColor, _Type;
    private int _ID;

    public Ellipse() {
    }

    public void setID(int ID) {
        this._ID = ID;
    }

    public String draw() {
        return "Ellipse {\n" +
                "\tX = " + _X + ",\n" +
                "\tY = " + _Y + ",\n" +
                "\tID = " + _ID + ",\n" +
                "\tStrokeWidth = " + _StrokeWidth + ",\n" +
                "\tAlpha = " + _Alpha + ",\n" +
                "\tRotateAngle = " + _RotateAngle + ",\n" +
                "\tStroke = '" + _Stroke + '\'' + ",\n" +
                "\tFillColor = '" + _FillColor + '\'' + ",\n" +
                "\tType = '" + _Type + '\'' + ",\n" +
                "\tRadiusX = " + _RadiusX + ",\n" +
                "\tRadiusY = " + _RadiusY + ",\n" +
                '}';
    }

    public float get_X() {
        return _X;
    }

    public void set_X(float _X) {
        this._X = _X;
    }

    public float get_Y() {
        return _Y;
    }

    public void set_Y(float _Y) {
        this._Y = _Y;
    }

    public float get_RadiusX() {
        return _RadiusX;
    }

    public void set_RadiusX(float _RadiusX) {
        this._RadiusX = _RadiusX;
    }

    public float get_RadiusY() {
        return _RadiusY;
    }

    public void set_RadiusY(float _RadiusY) {
        this._RadiusY = _RadiusY;
    }

    public float get_StrokeWidth() {
        return _StrokeWidth;
    }

    public void set_StrokeWidth(float _StrokeWidth) {
        this._StrokeWidth = _StrokeWidth;
    }

    public float get_Alpha() {
        return _Alpha;
    }

    public void set_Alpha(float _Alpha) {
        this._Alpha = _Alpha;
    }

    public float get_RotateAngle() {
        return _RotateAngle;
    }

    public void set_RotateAngle(float _RotateAngle) {
        this._RotateAngle = _RotateAngle;
    }

    public String get_Stroke() {
        return _Stroke;
    }

    public void set_Stroke(String _Stroke) {
        this._Stroke = _Stroke;
    }

    public String get_FillColor() {
        return _FillColor;
    }

    public void set_FillColor(String _FillColor) {
        this._FillColor = _FillColor;
    }

    public String get_Type() {
        return _Type;
    }

    public void set_Type(String _Type) {
        this._Type = _Type;
    }

    public int get_ID() {
        return _ID;
    }

    public void set_ID(int _ID) {
        this._ID = _ID;
    }
}
