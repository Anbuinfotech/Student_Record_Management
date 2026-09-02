package com.srms.studentrecord.controller;

import com.srms.studentrecord.entity.User;
import com.srms.studentrecord.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        User user = authService.register(request.email(), request.password());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse("Registration successful", UserResponse.from(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        User user = authService.login(request.email(), request.password());
        return ResponseEntity.ok(new AuthResponse("Login successful", UserResponse.from(user)));
    }

    public record AuthRequest(
            @NotBlank(message = "Email is required")
            @Email(message = "Email should be valid")
            String email,
            @NotBlank(message = "Password is required")
            @Size(min = 8, message = "Password must be at least 8 characters")
            String password) {
    }

    public record AuthResponse(String message, UserResponse user) {
    }

    public record UserResponse(Long id, String email) {
        private static UserResponse from(User user) {
            return new UserResponse(user.getId(), user.getEmail());
        }
    }
}