package com.yourapp.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.ecommerce.dto.CheckoutRequestDTO;
import com.yourapp.ecommerce.entity.Order;
import com.yourapp.ecommerce.service.OrderService;

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
