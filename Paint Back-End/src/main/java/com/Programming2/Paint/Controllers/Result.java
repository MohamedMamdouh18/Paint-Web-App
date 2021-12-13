package com.Programming2.Paint.Controllers;

public class Result {
    private String message = "";
    private Boolean error = false;

    public Result(String message, Boolean error) {
        this.message = message;
        this.error = error;
    }

    public Result() {

    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getError() {
        return error;
    }

    public void setError(Boolean error) {
        this.error = error;
    }

    public String written() {
        return "Result: \n" +
                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t---> " +
                "Message = " + message + "\n" +
                "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t---> " +
                "Error = " + error + "\n";
    }
}