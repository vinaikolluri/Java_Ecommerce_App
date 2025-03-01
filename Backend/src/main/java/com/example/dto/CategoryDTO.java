package com.example.dto;

public class CategoryDTO {
    private String categoryName;
    private String description;
    private Long parentId;

    // Default constructor
    public CategoryDTO() {
    }

    // Parameterized constructor
    public CategoryDTO(String categoryName, String description, Long parentId) {
        this.categoryName = categoryName;
        this.description = description;
        this.parentId = parentId;
    }

    // Getters and Setters
    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
}
