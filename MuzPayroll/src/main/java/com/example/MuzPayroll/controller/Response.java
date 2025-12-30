package com.example.MuzPayroll.controller;

public class Response<T> {

    private boolean success = false; // 🔴 default false
    private String message;
    private T data;

    public Response() {
    }

    public Response(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    /* ================= FACTORY METHODS ================= */

    // Use ONLY at FINAL step
    public static <T> Response<T> finalSuccess(T data) {
        return new Response<>(true, null, data);
    }

    // Validation / intermediate step success (no UI impact)
    public static <T> Response<T> pass() {
        return new Response<>(true, null, null);
    }

    public static <T> Response<T> error(String message) {
        return new Response<>(false, message, null);
    }

    /* ================= HELPERS ================= */

    public boolean isSuccess() {
        return success;
    }

    public void markSuccess() {
        this.success = true;
    }

    public void markFailure(String message) {
        this.success = false;
        this.message = message;
    }

    public static <T> Response<T> success(T data) {
        return new Response<>(true, null, data);
    }

    /* ================= GETTERS / SETTERS ================= */

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
