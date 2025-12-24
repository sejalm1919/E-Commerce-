package com.ecommerce.backend.dto;

public class LoginResponse {

    private String token;
    private String email;
    private String role;
    private String username;

    public LoginResponse(String token, String email, String role, String username) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getUsername() {
        return username;
    }
}