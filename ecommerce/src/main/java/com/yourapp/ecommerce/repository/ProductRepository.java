package com.yourapp.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourapp.ecommerce.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
