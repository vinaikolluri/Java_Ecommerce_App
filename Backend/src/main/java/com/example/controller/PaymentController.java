package com.example.controller;

import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.PaymentRequest;
import com.example.entity.Cart;
import com.example.service.CartService;
import com.example.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private CartService cartService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/proceedToPayment")
    public ResponseEntity<?> proceedToPayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            List<Cart> cartItems = cartService.findCartByBuyerId(paymentRequest.getBuyerId());
            if (cartItems.isEmpty()) {
                return new ResponseEntity<>("Cart is empty. Add items to proceed.", HttpStatus.BAD_REQUEST);
            }

            double totalAmount = cartItems.stream()
                    .mapToDouble(Cart::getTotalPrice)
                    .sum();

            if ("COD".equalsIgnoreCase(paymentRequest.getPaymentMethod())) {
                for (Cart cart : cartItems) {
                    String codOrderId = "COD_" + System.currentTimeMillis() + "_" + cart.getId();
                    paymentService.saveOrderDetails(
                            paymentRequest.getBuyerId(),
                            paymentRequest.getBuyerName(),
                            paymentRequest.getBuyerMobileNo(),
                            paymentRequest.getStreet(),
                            paymentRequest.getCity(),
                            paymentRequest.getState(),
                            paymentRequest.getPincode(),
                            paymentRequest.getCountry(),
                            paymentRequest.getDeliveryAddress(),
                            cart.getTotalPrice(),
                            "COD",
                            codOrderId,
                            cart.getProduct().getId()
                    );
                }
                cartService.clearCartByBuyerId(paymentRequest.getBuyerId());
                return new ResponseEntity<>("Orders placed successfully with Cash on Delivery.", HttpStatus.OK);
            } else if ("ONLINE".equalsIgnoreCase(paymentRequest.getPaymentMethod())) {
                RazorpayClient razorpay = new RazorpayClient("rzp_test_tDyTm24qcfv5o0", "ksEtos4sBkrcFQmvbtpdqC1m");
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", totalAmount * 100); // Amount in paise
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", "txn_" + paymentRequest.getBuyerId());
                Order razorpayOrder = razorpay.orders.create(orderRequest);

                for (Cart cart : cartItems) {
                    paymentService.saveOrderDetails(
                            paymentRequest.getBuyerId(),
                            paymentRequest.getBuyerName(),
                            paymentRequest.getBuyerMobileNo(),
                            paymentRequest.getStreet(),
                            paymentRequest.getCity(),
                            paymentRequest.getState(),
                            paymentRequest.getPincode(),
                            paymentRequest.getCountry(),
                            paymentRequest.getDeliveryAddress(),
                            cart.getTotalPrice(),
                            "ONLINE",
                            razorpayOrder.get("id"),
                            cart.getProduct().getId()
                    );
                }
                cartService.clearCartByBuyerId(paymentRequest.getBuyerId());
                return new ResponseEntity<>(razorpayOrder.toString(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid payment method. Please select 'COD' or 'ONLINE'.", HttpStatus.BAD_REQUEST);
            }
        } catch (RazorpayException e) {
            return new ResponseEntity<>("Error creating Razorpay order: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Error proceeding to payment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/verifyPayment")
    public ResponseEntity<?> verifyPayment(
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpaySignature) {
        try {
            boolean isVerified = paymentService.verifyPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature);
            if (isVerified) {
                return new ResponseEntity<>("Payment successful and verified.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Payment verification failed.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error verifying payment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}