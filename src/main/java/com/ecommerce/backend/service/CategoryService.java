package com.ecommerce.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ecommerce.backend.dto.CategoryResponse;
import com.ecommerce.backend.dto.CreateCategoryRequest;
import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.exception.CustomException;
import com.ecommerce.backend.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponse createCategory(CreateCategoryRequest request) {

        if (categoryRepository.existsByName(request.getName())) {
            throw new CustomException("Category already exists", 400);
        }

        Category category = new Category(
                request.getName(),
                request.getDescription()
        );

        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public CategoryResponse updateCategory(Long id, CreateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CustomException("Category not found", 404));

        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new CustomException("Category name already exists", 400);
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CustomException("Category not found", 404));

        category.setActive(false);
        categoryRepository.save(category);
    }
    
    public List<CategoryResponse> searchCategories(String name) {
        List<Category> categories;

        if (name != null && !name.isEmpty()) {
            categories = categoryRepository.findByNameContainingIgnoreCaseAndActiveTrue(name);
        } else {
            categories = categoryRepository.findByActiveTrue();
        }

        return categories.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.isActive()
        );
    }
}