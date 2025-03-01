package com.example.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    // Custom query to find cart items by buyer ID
    List<Cart> findByBuyerId(Long buyerId);
}
