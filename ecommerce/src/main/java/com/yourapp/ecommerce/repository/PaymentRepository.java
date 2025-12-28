package com.yourapp.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourapp.ecommerce.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
