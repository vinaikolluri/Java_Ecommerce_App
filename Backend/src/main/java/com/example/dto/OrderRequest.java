package com.example.dto;
public class OrderRequest {
    private Long buyerId;
    private Long productId;
    private String deliveryAddress;
    private String paymentMethod;
    
    private double totalAmount;
     private String paymentOrderId; // Razorpay order ID or COD order ID
    private String orderStatus; // PENDING, COMPLETED, CANCELLED
    private String buyerName;
	private Long buyerMobileNo;
	private String city;
	private String state;
	private String pincode;
	private String street;
	private String country;
	public Long getBuyerId() {
		return buyerId;
	}
	public void setBuyerId(Long buyerId) {
		this.buyerId = buyerId;
	}
	public Long getProductId() {
		return productId;
	}
	public void setProductId(Long productId) {
		this.productId = productId;
	}
	public String getDeliveryAddress() {
		return deliveryAddress;
	}
	public void setDeliveryAddress(String deliveryAddress) {
		this.deliveryAddress = deliveryAddress;
	}
	public String getPaymentMethod() {
		return paymentMethod;
	}
	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
	public double getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}
	public String getPaymentOrderId() {
		return paymentOrderId;
	}
	public void setPaymentOrderId(String paymentOrderId) {
		this.paymentOrderId = paymentOrderId;
	}
	public String getOrderStatus() {
		return orderStatus;
	}
	public void setOrderStatus(String orderStatus) {
		this.orderStatus = orderStatus;
	}
	public String getBuyerName() {
		return buyerName;
	}
	public void setBuyerName(String buyerName) {
		this.buyerName = buyerName;
	}
	public Long getBuyerMobileNo() {
		return buyerMobileNo;
	}
	public void setBuyerMobileNo(Long buyerMobileNo) {
		this.buyerMobileNo = buyerMobileNo;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getPincode() {
		return pincode;
	}
	public void setPincode(String pincode) {
		this.pincode = pincode;
	}
	public String getStreet() {
		return street;
	}
	public void setStreet(String street) {
		this.street = street;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}

    // Getters and Setters
    
}
