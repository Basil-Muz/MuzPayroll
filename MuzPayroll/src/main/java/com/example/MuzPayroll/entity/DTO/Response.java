package com.example.MuzPayroll.entity.DTO;

import java.util.ArrayList;
import java.util.List;

public class Response<T> {
    private boolean success;
    private int statusCode;
    private T data;
    private List<String> errors;
    
    // ============ CONSTRUCTORS ============
    
    private Response(boolean success, int statusCode, T data, List<String> errors) {
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
        this.errors = errors != null ? errors : new ArrayList<>();
    }
    
    // ============ FACTORY METHODS ============
    
    // Success with data
    public static <T> Response<T> success(T data) {
        return new Response<>(true, 200, data, null);
    }
    
    // Success without data
    public static <T> Response<T> success() {
        return new Response<>(true, 200, null, null);
    }
    
    // Error with single message
    public static <T> Response<T> error(String message) {
        List<String> errors = new ArrayList<>();
        errors.add(message);
        return new Response<>(false, 400, null, errors);
    }
    
    // Error with multiple messages
    public static <T> Response<T> error(List<String> errors) {
        return new Response<>(false, 400, null, errors);
    }
    
    // Error with custom status code
    public static <T> Response<T> error(List<String> errors, int statusCode) {
        return new Response<>(false, statusCode, null, errors);
    }
    
    // Error with single message and custom status code
    public static <T> Response<T> error(String message, int statusCode) {
        List<String> errors = new ArrayList<>();
        errors.add(message);
        return new Response<>(false, statusCode, null, errors);
    }
    
    // ============ HELPER METHODS ============
    
    public void addError(String error) {
        if (this.errors == null) {
            this.errors = new ArrayList<>();
        }
        this.errors.add(error);
        this.success = false;
    }
    
    public boolean hasErrors() {
        return errors != null && !errors.isEmpty();
    }
    
    // ============ GETTERS & SETTERS ============
    
    public boolean isSuccess() {
        return success;
    }
    
    public int getStatusCode() {
        return statusCode;
    }
    
    public T getData() {
        return data;
    }
    
    public List<String> getErrors() {
        return errors;
    }
}