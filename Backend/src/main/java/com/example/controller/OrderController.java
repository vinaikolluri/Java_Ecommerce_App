package com.example.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dao.OrderRepository;
import com.example.entity.Order;
@RestController
@RequestMapping("/Order")
public class OrderController {

	@Autowired
    private OrderRepository orderRepository;
	
	
	/*
	 * // Get order by orderId
	 * 
	 * @GetMapping("/byOrderId/{orderId}") public ResponseEntity<Order>
	 * getOrderByOrderId(@PathVariable String orderId) { Optional<Order> order =
	 * orderRepository.findByOrderId(orderId); if (order.isPresent()) { return new
	 * ResponseEntity<>(order.get(), HttpStatus.OK); } else { return new
	 * ResponseEntity<>(null, HttpStatus.NOT_FOUND); } }
	 */
	@GetMapping("/findByBuyerid")
    public ResponseEntity<List<Order>> getOrdersByBuyerId(@RequestParam String buyerid) {
        try {
            Long buyerId = Long.parseLong(buyerid); // Convert String to Long
            List<Order> orders = orderRepository.findByBuyerId(buyerId);
            if (!orders.isEmpty()) {
                return new ResponseEntity<>(orders, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (NumberFormatException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Handle invalid buyerId format
        }
    }
    // Get all orders
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        if (orders.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
}
