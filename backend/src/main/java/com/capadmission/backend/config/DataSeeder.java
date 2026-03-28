package com.capadmission.backend.config;

import com.capadmission.backend.model.College;
import com.capadmission.backend.repository.CollegeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CollegeRepository collegeRepository;

    @Override
    public void run(String... args) throws Exception {
        if (collegeRepository.count() > 0) {
            System.out.println("Colleges already seeded.");
            return;
        }

        System.out.println("Seeding Colleges...");
        List<College> allColleges = new ArrayList<>();

        // Helper Map to mimic the frontend data structure
        // Name, Base Rank
        // Using mutable maps to avoid Map.of 10-entry limit
        Map<String, Integer> topColleges = new java.util.HashMap<>();
        topColleges.put("COEP Pune", 120);
        topColleges.put("VJTI Mumbai", 150);
        topColleges.put("SPIT Mumbai", 300);
        topColleges.put("PICT Pune", 450);
        topColleges.put("Walchand Sangli", 600);
        topColleges.put("VIT Pune", 900);
        topColleges.put("D.J. Sanghvi Mumbai", 1100);
        topColleges.put("PCCOE Pune", 1500);
        topColleges.put("Thadomal Shahani", 1800);
        topColleges.put("Cummins College (Women)", 2000);
        topColleges.put("V.E.S.I.T. Mumbai", 2500);
        topColleges.put("K.J. Somaiya Mumbai", 2800);
        topColleges.put("MIT WPU Pune", 3200);
        topColleges.put("DY Patil Akurdi", 3800);
        topColleges.put("RCOEM Nagpur", 4500);
        topColleges.put("Vishwakarma Institute", 4800);
        topColleges.put("Govt College Aurangabad", 5000);
        topColleges.put("Govt College Amravati", 5500);

        Map<String, Integer> mediumColleges = new java.util.HashMap<>();
        mediumColleges.put("DY Patil Pimpri", 22000);
        mediumColleges.put("Indira College", 23000);
        mediumColleges.put("JSPM Narhe", 24000);
        mediumColleges.put("Keystone School", 25000);
        mediumColleges.put("PCCOE Ravet", 26000);
        mediumColleges.put("Sinhgad College", 27000);
        mediumColleges.put("PVG Pune", 28000);
        mediumColleges.put("AISSMS IOit", 29000);
        mediumColleges.put("Modern College", 30000);
        mediumColleges.put("DY Patil Akurdi", 31000);

        Map<String, Integer> lowColleges = new java.util.HashMap<>();
        lowColleges.put("Tatyasaheb Kore", 125000);
        lowColleges.put("Terna Public", 126000);
        lowColleges.put("Theem College", 127000);
        lowColleges.put("Dattakala Group", 130000);
        lowColleges.put("NBN Sinhgad", 135000);
        lowColleges.put("Trinity College", 140000);
        generateVariants(allColleges, topColleges, "Top");
        generateVariants(allColleges, mediumColleges, "Medium");
        generateVariants(allColleges, lowColleges, "Low");

        collegeRepository.saveAll(allColleges);
        System.out.println("Seeding Complete. Added " + allColleges.size() + " colleges.");
    }

    private void generateVariants(List<College> list, Map<String, Integer> source, String type) {
        source.forEach((name, rank) -> {
            // Computer - OPEN
            list.add(College.builder().name(name).branch("Computer").category("OPEN").closingRank(rank).round("CAP-1")
                    .type(type).location(detectLocation(name)).build());
            // Computer - OBC
            list.add(College.builder().name(name).branch("Computer").category("OBC").closingRank(rank + 1500)
                    .round("CAP-1").type(type).location(detectLocation(name)).build());
            // IT - OPEN
            list.add(College.builder().name(name).branch("IT").category("OPEN").closingRank(rank + 800).round("CAP-1")
                    .type(type).location(detectLocation(name)).build());
        });
    }

    private String detectLocation(String name) {
        if (name.contains("Mumbai") || name.contains("Bandra") || name.contains("Thane"))
            return "Mumbai";
        if (name.contains("Pune") || name.contains("Pimpr") || name.contains("Akurdi"))
            return "Pune";
        if (name.contains("Sangli"))
            return "Sangli";
        if (name.contains("Nagpur"))
            return "Nagpur";
        return "Maharashtra";
    }
}
