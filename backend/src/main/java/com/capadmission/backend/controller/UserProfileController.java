package com.capadmission.backend.controller;

import com.capadmission.backend.model.User;
import com.capadmission.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody User updatedData) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields
        if (updatedData.getRank() != null)
            user.setRank(updatedData.getRank());
        if (updatedData.getPercentile() != null)
            user.setPercentile(updatedData.getPercentile());
        if (updatedData.getCategory() != null)
            user.setCategory(updatedData.getCategory());
        if (updatedData.getGender() != null)
            user.setGender(updatedData.getGender());
        if (updatedData.getFirstName() != null)
            user.setFirstName(updatedData.getFirstName());
        if (updatedData.getLastName() != null)
            user.setLastName(updatedData.getLastName());
        if (updatedData.getBranch() != null)
            user.setBranch(updatedData.getBranch());

        // Don't update email/password here lightly

        return ResponseEntity.ok(userRepository.save(user));
    }
}
