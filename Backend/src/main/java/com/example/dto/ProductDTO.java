package com.example.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

public class ProductDTO {
    private String productName;
    private String description;
    private double price;
    private Long totalQuantity;
    private String minQuantity;
    private Long colorId;
    private Long sizeId;
    private Long thicknessId;
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
    private Long subCategoryId;
    private Long categoryId;
    
    private Long surfaceId;
    

    public Long getSurfaceId() {
		return surfaceId;
	}

	public void setSurfaceId(Long surfaceId) {
		this.surfaceId = surfaceId;
	}

	public Long getColorId() {
		return colorId;
	}

	public void setColorId(Long colorId) {
		this.colorId = colorId;
	}

	public Long getSizeId() {
		return sizeId;
	}

	public void setSizeId(Long sizeId) {
		this.sizeId = sizeId;
	}

	public Long getThicknessId() {
		return thicknessId;
	}

	public void setThicknessId(Long thicknessId) {
		this.thicknessId = thicknessId;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	// Getters and Setters
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

    public Long getSubCategoryId() {
        return subCategoryId;
    }

    public void setSubCategoryId(Long subCategoryId) {
        this.subCategoryId = subCategoryId;
    }
}
