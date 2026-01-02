package com.ecommerce.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.dto.AddToCartRequest;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // ADD TO CART
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @AuthenticationPrincipal User user,
            @RequestBody AddToCartRequest request) {

        cartService.addToCart(user, request);
        return ResponseEntity.ok("Product added to cart");
    }

    // VIEW CART
    @GetMapping
    public ResponseEntity<List<CartItem>> viewCart(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(cartService.getCart(user));
    }
}
