package com.hrpfa.hr_pfa.models;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false , updatable = false)
    private long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role;
}
