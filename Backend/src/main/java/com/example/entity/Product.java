package com.example.entity;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private String description;
    private double price;
    private Long totalQuantity;
    private String minQuantity;

    private String availableQuantity;
    private String partialQuantity;
    private String availability;
    private String originOfCountry;
    private String deliveryFrom;
    private String inspection;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date listedOn;

    private String emi;
    private String payLater;

    private String image1;
    private String image2;
    private String image3;
    private String video1; // Optional field

    
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "sub_category_id", nullable = true)
    private SubCategory subCategory;

    @ManyToOne
    @JoinColumn(name = "colour_id", nullable = false)
    private Colour colour;

    @ManyToOne
    @JoinColumn(name = "size_id", nullable = false)
    private Size size;

    @ManyToOne
    @JoinColumn(name = "thickness_id", nullable = false)
    private Thickness thickness;

    @ManyToOne
    @JoinColumn(name = "surfaceFinish_id", nullable = false)
    private SurfaceFinish surfaceFinish; // New field for SurfaceFinish

    // Default constructor
    public Product() {
    }

    // Parameterized constructor
    public Product(String productName, String description, double price, Long totalQuantity, String minQuantity,
                   String availableQuantity, String partialQuantity, String availability, String originOfCountry,
                   String deliveryFrom, String inspection, Date listedOn, String emi, String payLater, String image1,
                   String image2, String image3, String video1, Category category, SubCategory subCategory,
                   Colour colour, Size size, Thickness thickness, SurfaceFinish surfaceFinish) { // Added SurfaceFinish
        this.productName = productName;
        this.description = description;
        this.price = price;
        this.totalQuantity = totalQuantity;
        this.minQuantity = minQuantity;
        this.availableQuantity = availableQuantity;
        this.partialQuantity = partialQuantity;
        this.availability = availability;
        this.originOfCountry = originOfCountry;
        this.deliveryFrom = deliveryFrom;
        this.inspection = inspection;
        this.listedOn = listedOn;
        this.emi = emi;
        this.payLater = payLater;
        this.image1 = image1;
        this.image2 = image2;
        this.image3 = image3;
        this.video1 = video1;
        this.category = category;
        this.subCategory = subCategory;
        this.colour = colour;
        this.size = size;
        this.thickness = thickness;
        this.surfaceFinish = surfaceFinish; // Assign SurfaceFinish
    }

    // Getters and Setters for SurfaceFinish
    public SurfaceFinish getSurfaceFinish() {
        return surfaceFinish;
    }

    public void setSurfaceFinish(SurfaceFinish surfaceFinish) {
        this.surfaceFinish = surfaceFinish;
    }

    // Getters and Setters for other fields
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public String getMinQuantity() {
        return minQuantity;
    }

    public void setMinQuantity(String minQuantity) {
        this.minQuantity = minQuantity;
    }

    public String getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(String availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public String getPartialQuantity() {
        return partialQuantity;
    }

    public void setPartialQuantity(String partialQuantity) {
        this.partialQuantity = partialQuantity;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getOriginOfCountry() {
        return originOfCountry;
    }

    public void setOriginOfCountry(String originOfCountry) {
        this.originOfCountry = originOfCountry;
    }

    public String getDeliveryFrom() {
        return deliveryFrom;
    }

    public void setDeliveryFrom(String deliveryFrom) {
        this.deliveryFrom = deliveryFrom;
    }

    public String getInspection() {
        return inspection;
    }

    public void setInspection(String inspection) {
        this.inspection = inspection;
    }

    public Date getListedOn() {
        return listedOn;
    }

    public void setListedOn(Date listedOn) {
        this.listedOn = listedOn;
    }

    public String getEmi() {
        return emi;
    }

    public void setEmi(String emi) {
        this.emi = emi;
    }

    public String getPayLater() {
        return payLater;
    }

    public void setPayLater(String payLater) {
        this.payLater = payLater;
    }

    public String getImage1() {
        return image1;
    }

    public void setImage1(String image1) {
        this.image1 = image1;
    }

    public String getImage2() {
        return image2;
    }

    public void setImage2(String image2) {
        this.image2 = image2;
    }

    public String getImage3() {
        return image3;
    }

    public void setImage3(String image3) {
        this.image3 = image3;
    }

    public String getVideo1() {
        return video1;
    }

    public void setVideo1(String video1) {
        this.video1 = video1;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public SubCategory getSubCategory() {
        return subCategory;
    }

    public void setSubCategory(SubCategory subCategory) {
        this.subCategory = subCategory;
    }

    public Colour getColour() {
        return colour;
    }

    public void setColour(Colour colour) {
        this.colour = colour;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public Thickness getThickness() {
        return thickness;
    }

    public void setThickness(Thickness thickness) {
        this.thickness = thickness;
    }

    // toString method
    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", productName='" + productName + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", totalQuantity=" + totalQuantity +
                ", minQuantity='" + minQuantity + '\'' +
                ", availableQuantity='" + availableQuantity + '\'' +
                ", partialQuantity='" + partialQuantity + '\'' +
                ", availability='" + availability + '\'' +
                ", originOfCountry='" + originOfCountry + '\'' +
                ", deliveryFrom='" + deliveryFrom + '\'' +
                ", inspection='" + inspection + '\'' +
                ", listedOn=" + listedOn +
                ", emi='" + emi + '\'' +
                ", payLater='" + payLater + '\'' +
                ", image1='" + image1 + '\'' +
                ", image2='" + image2 + '\'' +
                ", image3='" + image3 + '\'' +
                ", video1='" + video1 + '\'' +
                ", category=" + (category != null ? category.getId() : null) +
                ", subCategory=" + (subCategory != null ? subCategory.getId() : null) +
                ", colour=" + (colour != null ? colour.getId() : null) +
                ", size=" + (size != null ? size.getId() : null) +
                ", thickness=" + (thickness != null ? thickness.getId() : null) +
                ", surfaceFinish=" + (surfaceFinish != null ? surfaceFinish.getId() : null) +  // Added surfaceFinish in toString
                '}';
    }
}
