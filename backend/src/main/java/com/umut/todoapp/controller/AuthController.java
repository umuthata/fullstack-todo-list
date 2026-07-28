package com.umut.todoapp.controller;

import com.umut.todoapp.dto.RegisterRequest;
import com.umut.todoapp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.umut.todoapp.dto.LoginRequest;
import org.springframework.security.core.Authentication;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Kayıt başarılı"));
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @Valid @RequestBody LoginRequest request) {

        String token = authService.login(request);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Giriş başarılı",
                        "token", token
                )
        );
    }
    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(
            Authentication authentication) {

        return ResponseEntity.ok(
                Map.of(
                        "username",
                        authentication.getName()
                )
        );
    }
}