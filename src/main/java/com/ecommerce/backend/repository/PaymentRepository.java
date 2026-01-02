package com.ecommerce.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.backend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
