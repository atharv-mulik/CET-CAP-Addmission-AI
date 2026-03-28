package com.capadmission.backend.service;

import com.capadmission.backend.model.College;
import com.capadmission.backend.repository.CollegeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final CollegeRepository collegeRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public List<College> getAiPredictedColleges(Integer rank, String category, String branch) {
        // 1. Call Python AI Model
        String aiUrl = "http://localhost:5000/predict";

        Map<String, Object> request = new HashMap<>();
        request.put("rank", rank);
        request.put("category", category);
        request.put("branch", branch != null ? branch : "Computer"); // Default branch if null

        try {
            // Expected Response: { "predicted_tier": "Top Tier (COEP/VJTI)",
            // "confidence_score": "85.20%" }
            Map<String, Object> aiResponse = restTemplate.postForObject(aiUrl, request, Map.class);

            String predictedTier = (String) aiResponse.get("predicted_tier");
            System.out.println("AI Predicted Tier: " + predictedTier);

            // 2. Filter DB based on AI suggestion
            // This logic maps the "Tier" string from Python back to College Types or Rank
            // ranges in SQL
            // For now, we hybridize: We use SQL for hard cutoff but prioritize the AI tier.

            // Simple hybrid: Use the AI's "Tier" perception to fetch colleges
            if (predictedTier != null && predictedTier.contains("Top Tier")) {
                return collegeRepository.findBestFitColleges(rank < 5000 ? rank : 5000, category);
            } else if (predictedTier != null && predictedTier.contains("Medium")) {
                // Relax the rank constraint slightly for medium tier
                return collegeRepository.findBestFitColleges(rank, category);
            }

            // Fallback: Standard SQL logic
            return collegeRepository.findBestFitColleges(rank, category);

        } catch (Exception e) {
            System.err.println("AI Service Unreachable: " + e.getMessage());
            // Fallback to purely rule-based
            return collegeRepository.findBestFitColleges(rank, category);
        }
    }
}
