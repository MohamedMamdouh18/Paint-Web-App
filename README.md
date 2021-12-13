# ***<span style="color:#FFC800">Pa</span><span style="color:#1B268F">int</span>***

- This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.12, and Spring Boot version 2.5.7 [Spring Boot](https://start.spring.io/).


## Authors:
> **Youssef Ali Bazina**
>
> **Mohamed Mamdouh Rashad**
>
> **Mahmoud Mohamed Abd-Elaziz**
>
> **Momen Mahmoud Gharib**

## Table of Contents

- [Setup](#Setup)
    - [Ports](#Ports)
    - [Packages-and-Running](#Packages-and-Running)
- [Design Patterns and UML Class Diagram](#Design-Patterns-and-UML-Class-Diagram)
    - [Design-Patterns](#Design-Patterns)
    - [UML-Class-Diagram](#UML-Class-Diagram)
- [Design-Decision](#Design-Decision)
- [Features-and-User-Guide](#Features-and-User-Guide)
    - [Features](#Features)
    - [User-Guide](#User-Guide)
    - [UI-Samples](#UI-Samples)

## Setup

### Ports

> -  The Back end is listening on port 8080.
>
> -  The Front end is listening on port 4200.

### Packages and Running

- To install packages, write "npm install" in the terminal for the
  front-end.

- Add [gson-2.8.9.jar](https://mvnrepository.com/artifact/com.google.code.gson/gson/2.8.9), [java-json.jar](https://jar-download.com/artifacts/org.json), [openijfx-17.0.1](https://gluonhq.com/products/javafx/) packages for the backend.

- To run the front write in the terminal `ng serve`.

## Design Pattern and UML Class Diagram

### Design Patterns

| **Design Patterns**|
| :----------------: |
| Factory Pattern    |
| Prototype Pattern  |
| Builder Pattern    |
| Bridge Pattern     |

- We combined **Factory** pattern and **Builder** pattern to make it easy to make the
  shapeInter object and konva shape which will be rendered on screen by generating both from the same object.

- Using **Factory** and **Builder** patterns, If the user wants the default shape which will be created from pressing any button of shapes' buttons in the GUI simply it will call the
  default director which will call the builder of the specific shape that the user asked for. The builder will make a konva shape object and ShapeInter object which the director will return to the user when asked. The user will get the specific shape by calling the director function of shape to create it only.

- In this way, the user doesn't know about the builder classes or the ShapeInter concrete classes.

- Using **Prototype** and **Builder** patterns, if the user wants to clone a shape, he will call the clone director which will take the desired shape to clone then call the builder of the shape which turn to make a copy of its konva shape and ShapeInter and return both to the user when asked through the clone director.

- **Bridge Pattern:** Used by making only two directors for all shapes without it, it would take us 10 directors for all shapes.


**UML Class Diagram**
![image](https://drive.google.com/uc?export=view&id=1FNfirG_4PP2ixCLCmzqIT9UKTTttJtUG)


![image](https://drive.google.com/uc?export=view&id=1rQwDJbuPXC3AMzaRZDFlkV75RpCJlh4j)

## Design Decisions
- To log the requests in back-end, AspectJ Logged before and after each method.

> Before : restart -> Clear All Stored Data\
> Success After : restart -> All Stored Data Cleared\
> Before : createShape polygon With ID 16\
> Success After : createShape polygon With ID 16\
> Before : createShape
> rectangle With ID 17\
> Success After : createShape rectangle With ID 17\
> Before : modifyShape
> polygon With ID 16\
> Success After : modifyShape polygon With ID 16\
> Before : undo -> To
> Previous Movement\
> Success After : undo -> To Previous Movement\
> Before : redo -> To Next Movement\
> Success After : redo -> To Next Movement\
> Before : save\
> Success After : save\
> Before : restart -> Clear All Stored Data\
> Success After : restart -> All Stored Data Cleared\
> Before : load\
> Success After : load

- Creating shapes, modifying attributes of an existing shape and saving is done through **post** request.

- **CreateShape** and **modifyShape** functions return an object from class **Result** that shows if the post request was performed correctly, or an error occurred.

- The shape created is added to **ObjectsStates** which is a **map** containing all shapes created and the history of their states.
- Undo, redo, the load is done through **get** request.

- Communication between the back-end and front-end is through strings. Front-end sends shape to back-end as a **JSON** object after casting it to string.

- Back-end receives shapes as a **string** and creates JSON objects with the same values in the string.

```
@RequestMapping(value = "/createShape/{type}/{id}", method = RequestMethod.POST, produces = "application/json; charset=utf-8")
@ResponseBody
public Result createShape(@RequestBody String inputData, @PathVariable String type, @PathVariable int id) throws JSONException {
    JSONObject jsonObj = new JSONObject(inputData);
    IShape shape = Utility.castJson(jsonObj, type);
```

- Depending on the type of the shape sent in the API request (Circle, polygon, ....), it creates a **java** object with the same attributes of the given JSON object using function **castJson** in Utility class (Factory design pattern).

```
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
```

- If an object is deleted, it is sent to coordinates outside the screen.

- design decisions in history, undo and redo. History consists of 3 components.

**ObjectsStates**: maps ids of shapes to states of shapes. **History_u stack**: Keeps track of ids of created and modified shapes. **History_r stack**: Keeps track of states that was popped from history_u stack due to undo.

- Each key in the **objectsStates** map has 2 values:
    - undo_stack: keeps track of the states of the shape.
    - redo_stack: keeps track of the states popped from undo_stack due to undo.

- When a shape is created:
    - Its id is added to **objectsStates** map, and its null value is pushed to undo_stack, then the object passed from the frontend is pushed to undo_stack, the id of the shape is passed to history_u.

![image](https://drive.google.com/uc?export=view&id=1UwZhBrLLsD8qufWJuUhpoHqlxqfDvdzw)

- When a shape is modified:
    - A new state is pushed to undo_stack, its id is passed to history_u.

![image](https://drive.google.com/uc?export=view&id=1Tjin7lqksQ3kiuda-08mcv_SDmUN4dcJ)

- On undo:

  -The top of undo_stack is popped and pushed to redo_stack, and the top history_u stack is popped and pushed to history_r stack.

![image](https://drive.google.com/uc?export=view&id=10jaK35KN6PNDBjSOW8xBxANBQFIahPiG)

- On redo:

    - The top of redo_stack is pushed to undo_stack.

![image](https://drive.google.com/uc?export=view&id=1nVSTblWTz5NbHMCm15RPCBCCFd5S6gTt)

## Features and User Guide

### Features

- A friendly Paint Web App with a friendly UI that helps the user with some Hotkeys and Shortcuts.

- Drawing Tools:

    - Selection Tool.
    - Free Hand Drawing "**Brush**".
    - A Variety of Shapes.
    - Save and Load for the items on the screen.
    - Undo and Redo.
    - Delete Selected items.
    - Colour Palette.
    - Settings for All Shapes.

### User Guide

- In the beginning, The default tool is the selection tool, then from the toolbar at the bottom of the screen, there are various tools to use it.

- The selected shapes will have a box around them with resizing corners.

- For the regular polygons, squares, and circles can be resized only diagonally to keep the ratio and the type of them, on the other side there is a rectangle, ellipse which can be resized every way.

- Line Segment is being resized by its length only.

- Settings in the bottom of the screen, when there is a shape or shapes selected, it helps to change some option for those but you should press enter key after changing any value.

- Toolbar Tools:

    - **Selection Tool:** This opens the selection option so that the shapes can be selected using the selection box. By holding the left click, and moving which shows up a rectangle to help you specify which shapes will be selected if it drops into this rectangle, or by clicking on the wanted shape.

    - **Paint Tool:** This allows you to use the brush to have some free drawings on the canvas also you can change the colour of these drawings after you finish then select this shape and change the stroke colour from the settings.

    - **Shapes Box Tool:** This has a variety of shapes that drops into the canvas by just clicking on it there is a fancy way that will be discussed later.
    - **Save and Load:** This saves the items on the canvas in two ways depending on which you choose either JSON or XML. Load loads the specified file either JSON or XML and deletes all the items that were on the canvas then add these shapes. In both, there is a file picker that opens to select the place and the file name to save and to select the file that will be loaded.
    - **Undo and Redo:** Undo movements or redo it again.
    - **Delete:** which deletes the selected shapes.

    - **Context Menu:** This one is the menu that drops after right-clicking on the canvas which allows you to copy or delete the selected shapes, and pastes the copied shapes where you want.

    - **The HotKeys:**

        - > "**V**" key select the selection tool.
        - > "**P**" key select the paint tool.
        - > "**S**" key drops a square into the canvas.
        - > "**T**" key drops a triangle into the canvas.
        - > "**R**" key drops a rectangle into the canvas.
        - > "**E**" key drops an ellipse into the canvas.
        - > "**C**" key drops a circle into the canvas.
        - > "**G**" key drops a pentagon into the canvas.
        - > "**H**" key drops a hexagon into the canvas.
        - > "**I**" key drops a line segment into the canvas.
        - > "**Control + Z**" key undo one move.
        - > "**Control + Shift + Z**" or "**Control + Y**"key redo one move.
        - > "**Control+A**" key selects all the shapes on the canvas.
        - > "**Control+C**" key copies the selected shapes to the clipboard.
        - > "**Control+V**" key pastes the copied shapes to the canvas where the pointer is.
        - > "**Control+S**" key saves all the shapes on the canvas to the specified file.
        - > "**L**" key loads the shapes from the chosen file.

### UI Samples

- Full Program.

![image](https://drive.google.com/uc?export=view&id=1Q8ZRcj9I5oqsJCQt2CAwu_SNdXRyHKQd)

- Toolbar.

![image](https://drive.google.com/uc?export=view&id=1ilEFewfosbwxJKzOVMcrC3BeFD2L9pRv)

- Toolkit.

![image](https://drive.google.com/uc?export=view&id=19EwBK-NMHiSW2Xtl9w24pqV6OQt9qwtC)

- Settings.

![image](https://drive.google.com/uc?export=view&id=11ZfavzMtzWem3oCmmOQlfYX0TCRi8hNd)
