package com.example.dto;

public class SubCategoryDTO {
    private String subCategoryName;
    private String description;
    private Long categoryId;

    // Default constructor
    public SubCategoryDTO() {
    }

    // Parameterized constructor
    public SubCategoryDTO(String subCategoryName, String description, Long categoryId) {
        this.subCategoryName = subCategoryName;
        this.description = description;
        this.categoryId = categoryId;
    }

    // Getters and Setters
    public String getSubCategoryName() {
        return subCategoryName;
    }

    public void setSubCategoryName(String subCategoryName) {
        this.subCategoryName = subCategoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
