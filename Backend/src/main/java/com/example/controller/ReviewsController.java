package com.example.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Reviews;
import com.example.service.ReviewsService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewsController {

    @Autowired
    private ReviewsService reviewsService;

    @GetMapping
    public ResponseEntity<List<Reviews>> getAllReviews() {
        List<Reviews> reviews = reviewsService.getAllReviews();
        if (reviews.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getReviewById(@PathVariable Long id) {
        Optional<Reviews> optionalReview = reviewsService.getReviewById(id);

        if (optionalReview.isPresent()) {
            return ResponseEntity.ok(optionalReview.get()); // Return the found review
        } else {
            return ResponseEntity.status(404).body("Review not found with id: " + id); // Return an error message
        }
    }




    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getReviewsByProductId(@PathVariable Long productId) {
        List<Reviews> reviews = reviewsService.getReviewsByProductId(productId);
        if (reviews.isEmpty()) {
            return ResponseEntity.status(404).body("No reviews found for productId: " + productId);
        }
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/addReview")
    public ResponseEntity<?> createReview(@RequestBody Reviews review) {
        try {
            Reviews createdReview = reviewsService.createReview(review);
            return ResponseEntity.status(201).body(createdReview);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error occurred while creating review: " + e.getMessage());
        }
    }

    @PutMapping("/updateReview/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody Reviews updatedReview) {
        Reviews review = reviewsService.updateReview(id, updatedReview);
        if (review == null) {
            return ResponseEntity.status(404).body("Review not found with id: " + id);
        }
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        if (reviewsService.deleteReview(id)) {
            return ResponseEntity.ok("Review deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Review not found with id: " + id);
        }
    }
}
