package com.ecommerce.backend.dto;

import java.math.BigDecimal;

public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private Double averageRating;
    private Integer ratingCount;
    private String categoryName;
    private boolean active;

    public ProductResponse() {
    }

    public ProductResponse(Long id, String name, String description,
                           BigDecimal price, Integer stockQuantity,
                           String imageUrl, Double averageRating, Integer ratingCount,
                           String categoryName, boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.averageRating = averageRating;
        this.ratingCount = ratingCount;
        this.categoryName = categoryName;
        this.active = active;
    }

    public Long getId() {
    	return id; 
    }
    
    public String getName() { 
    	return name; 
    }
    
    public String getDescription() { 
    	return description; 
    }
    
    public BigDecimal getPrice() { 
    	return price; 
    }
    
    public Integer getStockQuantity() { 
    	return stockQuantity; 
    }
    
    public String getImageUrl() { 
    	return imageUrl; 
    }
    
    public Double getAverageRating() { 
    	return averageRating; 
    }
    
    public Integer getRatingCount() { 
    	return ratingCount; 
    }
    
    public String getCategoryName() { 
    	return categoryName; 
    }
    
    public boolean isActive() { 
    	return active; 
    }
}