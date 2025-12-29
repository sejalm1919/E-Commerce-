package com.ecommerce.backend.service;

import com.ecommerce.backend.Entity.Product;
import com.ecommerce.backend.Entity.Review;
import com.ecommerce.backend.Repository.ProductRepository;
import com.ecommerce.backend.Repository.ReviewRepository;
import com.ecommerce.backend.dto.CreateReviewDto;
import com.ecommerce.backend.dto.ReviewDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepo;
    private final ProductRepository productRepo;

    public ReviewDto createReview(CreateReviewDto dto) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = new Review();
        review.setComment(dto.getComment());
        review.setRating(dto.getRating());
        review.setProduct(product);
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepo.save(review);
        return toDto(savedReview);
    }

    public List<ReviewDto> getReviewsByProduct(Long productId) {
        return reviewRepo.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ReviewDto toDto(Review review) {
        return new ReviewDto(
                review.getId(),
                review.getComment(),
                review.getRating(),
                review.getCreatedAt()
        );
    }
}
