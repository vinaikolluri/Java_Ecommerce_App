package com.example.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.entity.Reviews;
import java.util.List;

public interface ReviewsRepository extends JpaRepository<Reviews, Long> {
    List<Reviews> findByProductId(Long productId);
}
