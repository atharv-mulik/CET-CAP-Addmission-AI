package com.capadmission.backend.controller;

import com.capadmission.backend.model.College;
import com.capadmission.backend.repository.CollegeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
@RequiredArgsConstructor
public class CollegeController {

    private final CollegeRepository collegeRepository;
    private final com.capadmission.backend.service.PredictionService predictionService;

    @GetMapping
    public ResponseEntity<List<College>> getAllColleges() {
        return ResponseEntity.ok(collegeRepository.findAll());
    }

    @GetMapping("/predict")
    public ResponseEntity<List<College>> predictColleges(
            @RequestParam Integer rank,
            @RequestParam String category,
            @RequestParam(required = false) String branch) {
        // Use AI Service for smart prediction
        return ResponseEntity.ok(predictionService.getAiPredictedColleges(rank, category, branch));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<College>> addColleges(@RequestBody List<College> colleges) {
        return ResponseEntity.ok(collegeRepository.saveAll(colleges));
    }
}
