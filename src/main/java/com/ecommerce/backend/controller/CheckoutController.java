package com.ecommerce.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.dto.CheckoutRequestDTO;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.service.OrderService;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final OrderService orderService;

    public CheckoutController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> checkout(@RequestBody CheckoutRequestDTO request) {
        Order order = orderService.placeOrder(request);
        return ResponseEntity.ok(order);
    }
}
