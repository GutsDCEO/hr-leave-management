package com.hrpfa.hr_pfa.models;

import jakarta.persistence.*;

import java.io.Serializable;

// NOTE :
// We use the @Entity to map this class to the database
@Entity
public class Employee implements Serializable {

    // NOTE :
    // This Serializable will serve later to transform the java class into different types of Stream because this class is going to be saved in the database and then it's gonna be sent to the frontend as json and this Serialization will help with the whole Process

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false , updatable = false)
    private Long id ;
    private String name;
    private String email;
    private String phone;
    private String jobTitle;
    private String imageUrl;
    @Column(unique = true, nullable = false , updatable = false)
    private String employeeCode;


    public Employee() {}

    public Employee(String name, String email, String phone, String jobTitle, String imageUrl, String employeeCode) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.jobTitle = jobTitle;
        this.imageUrl = imageUrl;
        this.employeeCode = employeeCode;

    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getJobTitle() {
        return jobTitle;
    }
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public String getEmployeeCode() {
        return employeeCode;
    }
    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    @Override
    public String toString() {
        return "Employee { " +
                "id = " + id + "/" +
                " , name : " + name + "/" +
                " , email : " + email + "/" +
                " , Job Title : " + jobTitle + "/" +
                " , phone : " + phone + "/" +
                " , image : " + imageUrl + "/" +
                " , employee code " + employeeCode + " }";

    }


}
