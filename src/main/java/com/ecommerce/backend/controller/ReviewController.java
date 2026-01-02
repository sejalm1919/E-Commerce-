package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CreateReviewDto;
import com.ecommerce.backend.dto.ReviewDto;
import com.ecommerce.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
		this.reviewService = reviewService;
	}

	@PostMapping
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody CreateReviewDto dto) {
        ReviewDto result = reviewService.createReview(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewDto> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }
}
