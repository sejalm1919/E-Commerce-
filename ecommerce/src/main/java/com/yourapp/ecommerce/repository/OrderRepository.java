package com.yourapp.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourapp.ecommerce.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}
