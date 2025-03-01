package com.example.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Order findByBuyerIdAndOrderStatus(Long buyerId, String orderStatus);

	Order findByBuyerIdAndProductId(Long buyerId, Long productId);
    Optional<Order> findByOrderId(String orderId); // Find by orderId

    List<Order> findByBuyerId(Long buyerId); // Use Long instead of String

}
