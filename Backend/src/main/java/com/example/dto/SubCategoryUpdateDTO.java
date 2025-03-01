package com.example.dto;

public class SubCategoryUpdateDTO {

    private Long id;

    private String subCategoryName;

    private String description;

    private Long categoryId;

    // Default constructor
    public SubCategoryUpdateDTO() {
    }

    // Parameterized constructor
    public SubCategoryUpdateDTO(Long id, String subCategoryName, String description, Long categoryId) {
        this.id = id;
        this.subCategoryName = subCategoryName;
        this.description = description;
        this.categoryId = categoryId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
