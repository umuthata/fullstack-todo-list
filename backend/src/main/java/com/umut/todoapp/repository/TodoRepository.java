package com.umut.todoapp.repository;

import com.umut.todoapp.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findAllByUserUsernameOrderByIdDesc(String username);

    Optional<Todo> findByIdAndUserUsername(
            Long id,
            String username
    );
}