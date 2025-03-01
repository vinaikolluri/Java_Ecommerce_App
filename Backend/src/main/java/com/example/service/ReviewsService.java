package com.example.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dao.ReviewsRepository;
import com.example.entity.Reviews;

@Service
public class ReviewsService {

    @Autowired
    private ReviewsRepository reviewsRepository;

    public List<Reviews> getAllReviews() {
        return reviewsRepository.findAll();
    }

    public Optional<Reviews> getReviewById(Long id) {
        return reviewsRepository.findById(id);
    }

    public Reviews createReview(Reviews review) {
        return reviewsRepository.save(review);
    }

    public Reviews updateReview(Long id, Reviews updatedReview) {
        return reviewsRepository.findById(id)
                .map(existingReview -> {
                    existingReview.setRating(updatedReview.getRating());
                    existingReview.setReview(updatedReview.getReview());
                    existingReview.setProductId(updatedReview.getProductId());
                    existingReview.setUserId(updatedReview.getUserId());
                    return reviewsRepository.save(existingReview);
                })
                .orElse(null); // Return null if not found
    }

    public boolean deleteReview(Long id) {
        if (reviewsRepository.existsById(id)) {
            reviewsRepository.deleteById(id);
            return true;
        }
        return false; // Indicate that the review was not found
    }

    public List<Reviews> getReviewsByProductId(Long productId) {
        return reviewsRepository.findAll()
                .stream()
                .filter(review -> productId.equals(review.getProductId()))
                .toList();
    }
}
