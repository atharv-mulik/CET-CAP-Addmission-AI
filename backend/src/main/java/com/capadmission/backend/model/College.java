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
@Table(name = "college")
public class College {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String branch; // Computer, IT, E&TC
    private String category; // OPEN, OBC, SC

    @Column(name = "closing_rank")
    private Integer closingRank;

    private String round; // CAP-1, CAP-2
    private String type; // Top, Medium, Low

    private String location; // Pune, Mumbai
}
