package com.Programming2.Paint.Controllers;

import com.Programming2.Paint.Shape.Shapes.IShape;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import javafx.util.Pair;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

@CrossOrigin()
@RestController
@RequestMapping("/paint")
public class shapeController {
    static GraphicsConfiguration gc;
    private Stack<Integer> history_u = new Stack<>();
    private Stack<Integer> history_r = new Stack<>();
    private Map<Integer, Pair<Stack<IShape>, Stack<IShape>>> ObjectsStates = new HashMap<>();

    @RequestMapping(value = "/createShape/{type}/{id}", method = RequestMethod.POST, produces = "application/json; charset=utf-8")
    @ResponseBody
    public Result createShape(@RequestBody String inputData, @PathVariable String type, @PathVariable int id) throws JSONException {

        JSONObject jsonObj = new JSONObject(inputData);
        IShape shape = Utility.castJson(jsonObj, type);
        shape.set_Type(type);
        history_u.push(id);
        ObjectsStates.put(id, new Pair<>(new Stack<>(), new Stack<>()));
        ObjectsStates.get(id).getKey().push(null);
        ObjectsStates.get(id).getKey().push(shape);
        history_r.clear();
        for (Map.Entry<Integer, Pair<Stack<IShape>, Stack<IShape>>> shape1 : ObjectsStates.entrySet()) {
            if (!shape1.getValue().getValue().empty())
                shape1.getValue().getValue().clear();
        }
        return new Result("Shape with ID " + id + " added successfully", false);
    }

    @RequestMapping(value = "/modifyShape/{type}/{id}", method = RequestMethod.POST)
    @ResponseBody
    public Result modifyShape(@RequestBody String inputData, @PathVariable String type, @PathVariable int id) throws JSONException {
        boolean flag = false;
        for (var ID : history_u) {
            if (ID == id) {
                flag = true;
                break;
            }
        }
        if (!flag)
            return new Result("No existing shape with this ID", true);
        JSONObject jsonObj = new JSONObject(inputData);
        IShape newShape = Utility.castJson(jsonObj, type);
        newShape.set_Type(type);
        ObjectsStates.get(id).getKey().push(newShape);
        history_u.push(id);
        history_r.clear();
        for (Map.Entry<Integer, Pair<Stack<IShape>, Stack<IShape>>> shape : ObjectsStates.entrySet()) {
            if (!shape.getValue().getValue().empty())
                shape.getValue().getValue().clear();
        }
        return new Result("Shape with ID " + id + " modified successfully", false);
    }

    @RequestMapping(value = "/undo", method = RequestMethod.GET)
    @ResponseBody
    public String undo() throws JSONException {
        String lastState;
        if (history_u.empty())
            return "Error";
        Integer id = history_u.peek();
        try {
            if (history_u.empty()) {
                return "Error";
            } else {
                var stack1 = ObjectsStates.get(id).getKey();
                var stack2 = ObjectsStates.get(id).getValue();
                stack2.push(stack1.pop());

                lastState = new Gson().toJson(new Pair<>(id, stack1.peek()));
            }
            history_r.push(history_u.pop());
            return lastState;
        } catch (Exception e) {
            return "Error";
        }
    }


    @RequestMapping(value = "/redo", method = RequestMethod.GET)
    @ResponseBody
    public String redo() {
        String newState;
        if (history_r.empty())
            return "Empty";
        Integer id = history_r.peek();
        try {
            if (history_r.empty())
                return "Error";
            else {
                var stack1 = ObjectsStates.get(id).getKey();
                var stack2 = ObjectsStates.get(id).getValue();
                if (stack2.empty())
                    return "Error";
                stack1.push(stack2.pop());
                newState = new Gson().toJson(new Pair<>(id, stack1.peek()));
            }
            history_u.push(history_r.pop());
            return newState;
        } catch (Exception e) {
            return "Error";
        }
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public void save() throws IOException {
        String t = "", n = "";
        // parent component of the dialog
        System.setProperty("java.awt.headless", "false");
        JFrame fe = new JFrame(gc);
        // set the size of the frame
        fe.setSize(800, 600);
        // set the frame's visibility
        fe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setPreferredSize(new Dimension(800, 600));
        fileChooser.setVisible(true);
        fe.setAlwaysOnTop(true);
        fileChooser.setDialogTitle("Specify a file to save");
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".json", "json"));
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".xml", "xml"));
        fileChooser.removeChoosableFileFilter(fileChooser.getAcceptAllFileFilter());
        int userSelection = fileChooser.showSaveDialog(fe);
        if (userSelection == JFileChooser.APPROVE_OPTION) {
            File fileToSave = fileChooser.getSelectedFile();
            t = fileChooser.getFileFilter().getDescription();
            n = fileToSave.getCanonicalPath();
            fe.remove(fileChooser);
        } else if (userSelection == JFileChooser.CANCEL_OPTION) {
            fileChooser.setVisible(false);
            fe.remove(fileChooser);
            return;
        }
        if (t.equals(".json")) {
            try {
                Gson gson = new GsonBuilder()
                        .setPrettyPrinting()
                        .create();
                FileWriter f = new FileWriter(n + t);
                ArrayList<IShape> x = new ArrayList<>();
                for (Map.Entry<Integer, Pair<Stack<IShape>, Stack<IShape>>> shape : ObjectsStates.entrySet()) {
                    if (!shape.getValue().getKey().empty() && shape.getValue().getKey().peek() != null) {
                        x.add(shape.getValue().getKey().peek());
                    }
                }
                gson.toJson(x, f);
                f.flush();
                f.close();

            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            try {
                FileOutputStream fos = new FileOutputStream(n + t);
                XMLEncoder encoder = new XMLEncoder(fos);
                ArrayList<IShape> buffer = new ArrayList<>();
                for (Map.Entry<Integer, Pair<Stack<IShape>, Stack<IShape>>> shape : ObjectsStates.entrySet()) {
                    if (!shape.getValue().getKey().empty() && shape.getValue().getKey().peek() != null) {
                        buffer.add(shape.getValue().getKey().peek());
                    }
                }
                encoder.writeObject(buffer);
                encoder.close();
                fos.flush();
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    @RequestMapping(value = "/load", method = RequestMethod.GET)
    public String load() throws IOException {
        Result res = new Result();
        String n = "", t = "";
        // parent component of the dialog
        System.setProperty("java.awt.headless", "false");
        JFrame fe = new JFrame(gc);
        // set the size of the frame
        fe.setSize(800, 600);
        // set the frame's visibility
        fe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setPreferredSize(new Dimension(800, 600));
        fileChooser.setVisible(true);
        fe.setAlwaysOnTop(true);
        fileChooser.setDialogTitle("Specify a file to save");
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".json", "json"));
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".xml", "xml"));
        fileChooser.removeChoosableFileFilter(fileChooser.getAcceptAllFileFilter());
        int userSelection = fileChooser.showOpenDialog(fe);
        if (userSelection == JFileChooser.APPROVE_OPTION) {
            File fileToLoad = fileChooser.getSelectedFile();
            n = fileToLoad.getCanonicalPath();
            t = fileChooser.getFileFilter().getDescription();
            fe.remove(fileChooser);
            fileChooser.setVisible(false);
        } else if (userSelection == JFileChooser.CANCEL_OPTION) {
            fileChooser.setVisible(false);
            fe.remove(fileChooser);
            res.setError(Boolean.TRUE);
            res.setMessage("Canceled");
            return "Error";
        }

        if (t.equals(".json")) {
            try {
                Gson json = new Gson();
                FileReader f = new FileReader(n);
                ArrayList<IShape> x = json.fromJson(f, ArrayList.class);
                f.close();
                String y = new Gson().toJson(x);
                res.setMessage(y);
                res.setError(Boolean.FALSE);
                return y;
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            FileInputStream f2 = new FileInputStream(n);
            XMLDecoder mydecoder = new XMLDecoder(f2);
            ArrayList<IShape> result = (ArrayList<IShape>) mydecoder.readObject();
            mydecoder.close();
            f2.close();
            Gson gson = new GsonBuilder()
                    .setPrettyPrinting()
                    .create();
            return gson.toJson(result);
        }
        return null;
    }

    @RequestMapping(value = "/restart", method = RequestMethod.POST)
    public void restart() {
        history_u.clear();
        history_r.clear();
        ObjectsStates.clear();
    }
}