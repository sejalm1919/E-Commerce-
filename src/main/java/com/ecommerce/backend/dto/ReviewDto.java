package com.ecommerce.backend.dto;

import java.time.LocalDateTime;

public class ReviewDto {
    private Long id;
    private String comment;
    private Integer rating;
    private LocalDateTime createdAt;
    
    public ReviewDto() {
	}
    
	public ReviewDto(Long id, String comment, Integer rating, LocalDateTime createdAt) {
		this.id = id;
		this.comment = comment;
		this.rating = rating;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	
	
    
}

