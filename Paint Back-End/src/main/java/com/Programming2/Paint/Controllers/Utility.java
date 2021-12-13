package com.Programming2.Paint.Controllers;

import com.Programming2.Paint.Shape.Shapes.*;
import com.google.gson.Gson;
import org.json.JSONObject;

public class Utility {
    public static IShape castJson(JSONObject jsonObj, String type) {
        IShape shape = null;
        Gson gson = new Gson();
        if (type.toLowerCase().equals("circle")) {
            shape = gson.fromJson(jsonObj.toString(), Circle.class);
        } else if (type.toLowerCase().equals(("polygon"))) {
            shape = gson.fromJson(jsonObj.toString(), Polygon.class);
        } else if (type.toLowerCase().equals(("rectangle"))) {
            shape = gson.fromJson(jsonObj.toString(), Rectangle.class);
        } else if (type.toLowerCase().equals(("ellipse"))) {
            shape = gson.fromJson(jsonObj.toString(), Ellipse.class);
        } else if (type.toLowerCase().equals(("linesegment"))) {
            shape = gson.fromJson(jsonObj.toString(), LineSegment.class);
        }
        return shape;
    }
}
