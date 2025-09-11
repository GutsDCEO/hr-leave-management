package com.hrpfa.hr_pfa.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false , updatable = false)
    private long id;
    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
    private String phone;

    @Column(nullable = false)
    private String role;

    // New fields to align with frontend DTO
    private String department;
    private String position;
    private String employeeId;
    private String avatarUrl;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserPreference> preferences;


    @Override
    public String toString() {
        return "User { " +
                "id = " + id + "/" +
                " , first name : " + firstName + "/" +
                " , last name : " + lastName + "/" +
                " , email : " + email + "/" +
                " , phone : " + phone + "/" +
                " , role : " + role + " }";

    }


    public void setUserCode(String string) {
    }
}
