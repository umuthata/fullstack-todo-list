package com.umut.todoapp.controller;

import com.umut.todoapp.dto.CreateTodoRequest;
import com.umut.todoapp.dto.TodoResponse;
import com.umut.todoapp.dto.UpdateTodoRequest;
import com.umut.todoapp.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(
            @Valid @RequestBody CreateTodoRequest request,
            Authentication authentication
    ) {
        String username = authentication.getName();

        TodoResponse createdTodo =
                todoService.createTodo(request, username);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdTodo);
    }

    @GetMapping
    public ResponseEntity<List<TodoResponse>> getTodos(
            Authentication authentication
    ) {
        String username = authentication.getName();

        List<TodoResponse> todos =
                todoService.getTodos(username);

        return ResponseEntity.ok(todos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTodoRequest request,
            Authentication authentication
    ) {
        String username = authentication.getName();

        TodoResponse updatedTodo = todoService.updateTodo(
                id,
                request,
                username
        );

        return ResponseEntity.ok(updatedTodo);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTodo(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String username = authentication.getName();

        todoService.deleteTodo(id, username);

        return ResponseEntity.ok(
                Map.of("message", "Todo başarıyla silindi")
        );
    }
}