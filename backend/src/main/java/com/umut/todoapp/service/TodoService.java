package com.umut.todoapp.service;

import com.umut.todoapp.dto.CreateTodoRequest;
import com.umut.todoapp.dto.TodoResponse;
import com.umut.todoapp.entity.Todo;
import com.umut.todoapp.entity.User;
import com.umut.todoapp.repository.TodoRepository;
import com.umut.todoapp.repository.UserRepository;
import com.umut.todoapp.dto.UpdateTodoRequest;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public TodoService(
            TodoRepository todoRepository,
            UserRepository userRepository
    ) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    public TodoResponse createTodo(
            CreateTodoRequest request,
            String username
    ) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Kullanıcı bulunamadı"
                        )
                );

        Todo todo = new Todo();

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(false);
        todo.setUser(user);

        Todo savedTodo = todoRepository.save(todo);

        return convertToResponse(savedTodo);
    }
    public List<TodoResponse> getTodos(String username) {

        return todoRepository
                .findAllByUserUsernameOrderByIdDesc(username)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }
    public TodoResponse updateTodo(
            Long id,
            UpdateTodoRequest request,
            String username
    ) {

        Todo todo = todoRepository
                .findByIdAndUserUsername(id, username)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Todo bulunamadı"
                        )
                );

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.isCompleted());

        Todo updatedTodo = todoRepository.save(todo);

        return convertToResponse(updatedTodo);
    }
    public void deleteTodo(Long id, String username) {

        Todo todo = todoRepository
                .findByIdAndUserUsername(id, username)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Todo bulunamadı"
                        )
                );

        todoRepository.delete(todo);
    }

    private TodoResponse convertToResponse(Todo todo) {

        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isCompleted()
        );
    }
}