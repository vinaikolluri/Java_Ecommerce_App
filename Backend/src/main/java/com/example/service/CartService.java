package com.example.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dao.CartRepository;
import com.example.dao.ProductRepository;
import com.example.dao.UserRepository;
import com.example.entity.Cart;
import com.example.entity.Product;
import com.example.entity.User;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Cart addProductToCart(Long productId, Long buyerId, Long quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive number.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found."));

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found or not authorized."));

        if (!"Buyer".equalsIgnoreCase(buyer.getRole())) {
            throw new IllegalArgumentException("User is not authorized to add products to cart.");
        }

        Cart cartItem = new Cart();
        cartItem.setProduct(product);
        cartItem.setNameOfBuyer(buyer.getFirstName());
        cartItem.setBuyer(buyer);
        cartItem.setProductQuantity(quantity);
        cartItem.setProductPrice((long) product.getPrice());
        cartItem.setTotalPrice(quantity * (long) product.getPrice());

        // Optional: Log the addition of a product to the cart
        // log.info("Product added to cart: " + product.getName() + ", Quantity: " + quantity);

        return cartRepository.save(cartItem);
    }

    @Transactional
    public Cart updateCart(Long cartId, Long quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive number.");
        }

        Cart cartItem = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found."));

        cartItem.setProductQuantity(quantity);
        cartItem.setTotalPrice(quantity * cartItem.getProductPrice());

        // Optional: Log the cart update
        // log.info("Cart updated: Cart ID = " + cartId + ", New Quantity = " + quantity);

        return cartRepository.save(cartItem);
    }

    @Transactional
    public void deleteCartItem(Long cartId) {
        if (!cartRepository.existsById(cartId)) {
            throw new IllegalArgumentException("Cart item does not exist.");
        }

        // Optional: Log the cart deletion
        // log.info("Cart item deleted: Cart ID = " + cartId);

        cartRepository.deleteById(cartId);
    }

    @Transactional(readOnly = true)
    public List<Cart> findCartByBuyerId(Long buyerId) {
        if (!userRepository.existsById(buyerId)) {
            throw new IllegalArgumentException("Buyer not found.");
        }

        // Optional: Log the cart retrieval
        // log.info("Retrieving cart items for buyer ID: " + buyerId);

        return cartRepository.findByBuyerId(buyerId);
    }
    
    public void clearCartByBuyerId(Long buyerId) {
        // Fetch all cart items for the buyer
        List<Cart> cartItems = cartRepository.findByBuyerId(buyerId);
        
        if (cartItems != null && !cartItems.isEmpty()) {
            // If cart items are found, delete them
            cartRepository.deleteAll(cartItems);
            // Or you can alternatively set a flag if you don't want to delete but mark them as cleared
            // cartItems.forEach(cartItem -> cartItem.setDeleted(true));
            // cartRepository.saveAll(cartItems);
        }
    }
}
