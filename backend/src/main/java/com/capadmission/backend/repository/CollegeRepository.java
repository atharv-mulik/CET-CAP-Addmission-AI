package com.capadmission.backend.repository;

import com.capadmission.backend.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CollegeRepository extends JpaRepository<College, Long> {

    List<College> findByClosingRankGreaterThanEqual(Integer rank);

    @Query("SELECT c FROM College c WHERE c.closingRank >= :rank AND c.category = :category ORDER BY c.closingRank ASC")
    List<College> findBestFitColleges(@Param("rank") Integer rank, @Param("category") String category);
}
