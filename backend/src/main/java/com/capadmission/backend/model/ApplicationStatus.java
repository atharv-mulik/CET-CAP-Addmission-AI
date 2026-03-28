package com.capadmission.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "application_status")
public class ApplicationStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private Integer currentStep; // 0 to N
    private String currentRound; // "CAP Round 1", "CAP Round 2"

    // Status flags
    private boolean registered;
    private boolean documentsVerified;
    private boolean optionsFilled;
    private boolean seatAccepted;
    private boolean reportedToInstitute;
}
