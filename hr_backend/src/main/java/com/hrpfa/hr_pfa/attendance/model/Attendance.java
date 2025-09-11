package com.hrpfa.hr_pfa.attendance.model;

import com.hrpfa.hr_pfa.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "attendance")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attendance implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate attendanceDate;

    @Column(nullable = false)
    private LocalTime clockIn;

    private LocalTime clockOut;

    @Override
    public String toString() {
        return "Attendance{" +
                "id=" + id +
                ", userId=" + user.getId() +
                ", attendanceDate=" + attendanceDate +
                ", clockIn=" + clockIn +
                ", clockOut=" + clockOut +
                '}';
    }

}
