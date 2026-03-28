package com.capadmission.backend.repository;

import com.capadmission.backend.model.ApplicationStatus;
import com.capadmission.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TrackerRepository extends JpaRepository<ApplicationStatus, Long> {
    Optional<ApplicationStatus> findByUser(User user);
}
