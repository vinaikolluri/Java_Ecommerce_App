package com.example.dto;

public class CategoryUpdateDTO {

    
    private Long id;

   
    private String categoryName;

    private String description;

    private Long parentId;

    // Default constructor
    public CategoryUpdateDTO() {
    }

    // Parameterized constructor
    public CategoryUpdateDTO(Long id, String categoryName, String description, Long parentId) {
        this.id = id;
        this.categoryName = categoryName;
        this.description = description;
        this.parentId = parentId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
