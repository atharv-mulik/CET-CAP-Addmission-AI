package com.capadmission.backend.controller;

import com.capadmission.backend.model.ApplicationStatus;
import com.capadmission.backend.model.User;
import com.capadmission.backend.repository.TrackerRepository;
import com.capadmission.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracker")
@RequiredArgsConstructor
public class TrackerController {

    private final TrackerRepository trackerRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApplicationStatus> getStatus() {
        User user = getCurrentUser();
        return ResponseEntity.ok(
                trackerRepository.findByUser(user)
                        .orElseGet(() -> createDefaultStatus(user)));
    }

    @PutMapping("/step")
    public ResponseEntity<ApplicationStatus> updateStep(@RequestParam Integer step) {
        User user = getCurrentUser();
        ApplicationStatus status = trackerRepository.findByUser(user)
                .orElseGet(() -> createDefaultStatus(user));

        status.setCurrentStep(step);
        return ResponseEntity.ok(trackerRepository.save(status));
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private ApplicationStatus createDefaultStatus(User user) {
        ApplicationStatus status = ApplicationStatus.builder()
                .user(user)
                .currentStep(0) // Start at step 0 (index for first round)
                .currentRound("CAP Round 1")
                .registered(true)
                .build();
        return trackerRepository.save(status);
    }
}
