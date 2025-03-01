package com.example.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dao.OrderRepository;
import com.example.entity.Order;
import com.razorpay.Utils;

@Service
public class PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    // Save order details with delivery address and amount
    public void saveOrderDetails(Long buyerId, String buyerName, Long buyerMobileNo, 
            String street, String city, String state, String pincode, 
            String country, String deliveryAddress, double amount, 
            String paymentMethod, String paymentOrderId, Long productId) {
    Order order = new Order();
    order.setOrderId(UUID.randomUUID().toString()); // Generate unique order ID
    order.setBuyerId(buyerId); // Set the buyer ID
    order.setBuyerName(buyerName); // Set the buyer's name
    order.setBuyerMobileNo(buyerMobileNo); // Set the buyer's mobile number
    order.setStreet(street); // Set the street address
    order.setCity(city); // Set the city
    order.setState(state); // Set the state
    order.setPincode(pincode); // Set the pincode
    order.setCountry(country); // Set the country
    order.setDeliveryAddress(deliveryAddress); // Set the delivery address
    order.setTotalAmount(amount); // Set the total amount passed in the request
    order.setPaymentMethod(paymentMethod); // Set the payment method (e.g., COD)
    order.setPaymentOrderId(paymentOrderId); // Set the payment order ID (custom for COD)
    order.setOrderStatus("PENDING"); // Default order status as PENDING
    order.setProductId(productId); // Set the product ID

    // Save the order details to the database
    orderRepository.save(order);
}


    public void saveOrderDetailsBuynow(Long buyerId,Long productId, String deliveryAddress, double totalAmount, String paymentMethod, String paymentOrderId) {
        Order order = new Order();
        order.setBuyerId(buyerId);
        order.setDeliveryAddress(deliveryAddress);
        order.setTotalAmount(totalAmount);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentOrderId(paymentOrderId);
        order.setProductId(productId); // Save productId
        order.setOrderStatus("PENDING"); // Default order status
        orderRepository.save(order);
    }

    // Confirm order for COD (Cash on Delivery) payment
    public void confirmOrderAsCOD(Long buyerId) {
        // Find the order by buyerId (assuming there's only one active order per buyer at a time)
        Order order = orderRepository.findByBuyerIdAndOrderStatus(buyerId, "PENDING");

        if (order != null) {
            // Update the order status to 'CONFIRMED' for COD
            order.setOrderStatus("CONFIRMED");
            orderRepository.save(order);
        } else {
            throw new RuntimeException("Order not found for the given buyer ID.");
        }
    }

    // Verify Razorpay payment using payment ID, order ID, and signature
    public boolean verifyPayment(String razorpayPaymentId, String razorpayOrderId, String razorpaySignature) {
        try {
            // Concatenate order ID and payment ID as per Razorpay documentation
            String payload = razorpayOrderId + "|" + razorpayPaymentId;

            // Replace "your_api_secret" with your actual Razorpay API secret
            return Utils.verifyWebhookSignature(payload, razorpaySignature, "ksEtos4sBkrcFQmvbtpdqC1m");
        } catch (Exception e) {
            throw new RuntimeException("Error verifying payment: " + e.getMessage());
        }
    }
    
    
    
    
    
    
}
