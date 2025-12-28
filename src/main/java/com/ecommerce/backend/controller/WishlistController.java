package com.ecommerce.backend.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.service.WishlistService;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // ADD TO WISHLIST
    @PostMapping("/add")
    public ResponseEntity<String> addToWishlist(
            @RequestParam Long productId,
            Principal principal
    ) {
        wishlistService.addToWishlist(principal.getName(), productId);
        return ResponseEntity.ok("Product added to wishlist");
    }

    // VIEW WISHLIST
    @GetMapping
    public ResponseEntity<?> getWishlist(Principal principal) {
        return ResponseEntity.ok(
                wishlistService.getWishlist(principal.getName())
        );
    }
}
