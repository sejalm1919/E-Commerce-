package com.ecommerce.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrue();

    List<Product> findByCategory(Category category);

    List<Product> findByCategoryAndActiveTrue(Category category);
    
    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);

    List<Product> findByCategoryAndNameContainingIgnoreCaseAndActiveTrue(Category category, String name);

    List<Product> findByPriceBetweenAndActiveTrue(Double minPrice, Double maxPrice);
}