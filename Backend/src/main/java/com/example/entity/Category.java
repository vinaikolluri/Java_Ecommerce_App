package com.example.entity;

import jakarta.persistence.*;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   
    private String categoryName;

   
    private String description;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private ParentCategory parent;

    // Default constructor
    public Category() {
    }

    // Parameterized constructor
    public Category(String categoryName, String description, ParentCategory parent) {
        this.categoryName = categoryName;
        this.description = description;
        this.parent = parent;
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

    public ParentCategory getParent() {
        return parent;
    }

    public void setParent(ParentCategory parent) {
        this.parent = parent;
    }

    // toString method
    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                ", categoryName='" + categoryName + '\'' +
                ", description='" + description + '\'' +
                ", parent=" + (parent != null ? parent.getId() : "null") +
                '}';
    }
}
