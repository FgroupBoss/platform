package com.family.edu.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseVO<T> {

    private int code;
    private String message;
    private T data;

    public static <T> ResponseVO<T> success(T data) {
        return new ResponseVO<T>(200, "success", data);
    }

    public static <T> ResponseVO<T> success() {
        return success(null);
    }

    public static <T> ResponseVO<T> fail(int code, String message) {
        return new ResponseVO<T>(code, message, null);
    }
}
