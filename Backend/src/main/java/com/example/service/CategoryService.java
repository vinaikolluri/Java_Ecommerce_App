package com.example.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dao.CategoryRepository;
import com.example.dao.ParentCategoryRepository;
import com.example.dao.SubCategpryRepository;
import com.example.dto.CategoryDTO;
import com.example.dto.CategoryUpdateDTO;
import com.example.dto.SubCategoryDTO;
import com.example.dto.SubCategoryUpdateDTO;
import com.example.entity.Category;
import com.example.entity.ParentCategory;
import com.example.entity.SubCategory;

@Service
public class CategoryService {
	
	@Autowired
	private ParentCategoryRepository parentRepo;
	@Autowired
	private CategoryRepository categoryRepo;
	@Autowired
	private SubCategpryRepository subCategoryRepo;
	
	
	public ParentCategory addParentCategory(ParentCategory category) {
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }

        
        try {
            return parentRepo.save(category);
        } catch (Exception e) {
            // Optional: Logging the exception for debugging purposes
            System.err.println("Error saving ParentCategory: " + e.getMessage());
            throw new RuntimeException("Failed to save ParentCategory", e);
        }
    }
	
	public Category addCategory(CategoryDTO categoryDTO) {
        if (categoryDTO == null) {
            throw new IllegalArgumentException("CategoryDTO cannot be null");
        }

        // Validate the parent category
        Optional<ParentCategory> parentCategoryOptional = parentRepo.findById(categoryDTO.getParentId());
        if (parentCategoryOptional.isEmpty()) {
            throw new IllegalArgumentException("Parent category with ID " + categoryDTO.getParentId() + " not found");
        }

        ParentCategory parentCategory = parentCategoryOptional.get();

        // Create and save the category
        Category category = new Category(
                categoryDTO.getCategoryName(),
                categoryDTO.getDescription(),
                parentCategory
        );

        return categoryRepo.save(category);
    }
	
	public SubCategory addSubCategory(SubCategoryDTO subCategoryDTO) {
        if (subCategoryDTO == null) {
            throw new IllegalArgumentException("SubCategoryDTO cannot be null");
        }

        // Validate if the Category exists using categoryId
        Optional<Category> categoryOptional = categoryRepo.findById(subCategoryDTO.getCategoryId());
        if (categoryOptional.isEmpty()) {
            throw new IllegalArgumentException("Category with ID " + subCategoryDTO.getCategoryId() + " not found");
        }

        Category category = categoryOptional.get();

        // Create the SubCategory object
        SubCategory subCategory = new SubCategory(
                subCategoryDTO.getSubCategoryName(),
                subCategoryDTO.getDescription(),
                category
        );

        // Save the SubCategory to the repository
        return subCategoryRepo.save(subCategory);
    }

	// Update ParentCategory
    public ParentCategory updateParentCategory(ParentCategory category) {
        if (category == null || category.getId() == null) {
            throw new IllegalArgumentException("ParentCategory or ID cannot be null");
        }

        Optional<ParentCategory> existingCategory = parentRepo.findById(category.getId());
        if (existingCategory.isEmpty()) {
            throw new IllegalArgumentException("ParentCategory with ID " + category.getId() + " not found");
        }

        return parentRepo.save(category); // Update the category
    }

    // Update Category
    public Category updateCategory(CategoryUpdateDTO categoryDTO) {
        if (categoryDTO == null || categoryDTO.getId() == null) {
            throw new IllegalArgumentException("CategoryDTO or ID cannot be null");
        }

        // Fetch the existing category
        Category existingCategory = categoryRepo.findById(categoryDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Category with ID " + categoryDTO.getId() + " not found"));

        // Fetch the parent category
        ParentCategory parentCategory = parentRepo.findById(categoryDTO.getParentId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Parent category with ID " + categoryDTO.getParentId() + " not found"));

        // Update fields
        existingCategory.setCategoryName(categoryDTO.getCategoryName());
        existingCategory.setDescription(categoryDTO.getDescription());
        existingCategory.setParent(parentCategory);

        // Save and return updated category
        return categoryRepo.save(existingCategory);
    }

    // Update SubCategory
    public SubCategory updateSubCategory(SubCategoryUpdateDTO subCategoryDTO) {
        if (subCategoryDTO == null || subCategoryDTO.getId() == null) {
            throw new IllegalArgumentException("SubCategoryDTO or ID cannot be null");
        }

        // Fetch the existing subcategory
        SubCategory existingSubCategory = subCategoryRepo.findById(subCategoryDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "SubCategory with ID " + subCategoryDTO.getId() + " not found"));

        // Fetch the category
        Category category = categoryRepo.findById(subCategoryDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Category with ID " + subCategoryDTO.getCategoryId() + " not found"));

        // Update fields
        existingSubCategory.setSubCategoryName(subCategoryDTO.getSubCategoryName());
        existingSubCategory.setDescription(subCategoryDTO.getDescription());
        existingSubCategory.setCategory(category);

        // Save and return updated subcategory
        return subCategoryRepo.save(existingSubCategory);
    }
    
    public List<ParentCategory>findallParentCategories(){
    	return parentRepo.findAll();
    }
    
    public List<Category>findAllCategories(){
    	return categoryRepo.findAll();
    }
    
    public List<SubCategory>findAllSubCategories(){
    	return subCategoryRepo.findAll();
    }
    
    public List<Category> findCategoriesByParentId(Long parentId) {
        return categoryRepo.findByParentId(parentId);
    }
    
    public List<SubCategory> findSubCategoriesByCategoryId(Long categoryId) {
        return subCategoryRepo.findByCategoryId(categoryId);
    }
}
