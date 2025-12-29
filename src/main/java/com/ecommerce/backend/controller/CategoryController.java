package com.ecommerce.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.backend.dto.CategoryResponse;
import com.ecommerce.backend.dto.CreateCategoryRequest;
import com.ecommerce.backend.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
@Validated
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CreateCategoryRequest request) {

        CategoryResponse response = categoryService.createCategory(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CreateCategoryRequest request) {

        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // SEARCH / FILTER CATEGORY (Public)
    @GetMapping("/search")
    public ResponseEntity<List<CategoryResponse>> searchCategories(
            @RequestParam(required = false) String name) {

        List<CategoryResponse> categories = categoryService.searchCategories(name);
        return ResponseEntity.ok(categories);
    }
}