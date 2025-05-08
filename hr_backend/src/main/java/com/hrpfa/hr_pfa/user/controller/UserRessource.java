package com.hrpfa.hr_pfa.user.controller;

import com.hrpfa.hr_pfa.user.service.UserService;
import com.hrpfa.hr_pfa.user.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserRessource {
    private final UserService userService;

    public UserRessource(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return  new ResponseEntity<>(users,HttpStatus.OK);
    }








}
