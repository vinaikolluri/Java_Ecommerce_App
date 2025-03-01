package com.example.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dao.ProductRepository;
import com.example.dao.UserRepository;
import com.example.dao.WishlistRepository;
import com.example.entity.Product;
import com.example.entity.User;
import com.example.entity.Wishlist;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Wishlist> getWishlistForUser(Long userId) {
        // Validate user existence
        validateUser(userId);
        return wishlistRepository.findByUserId(userId);
    }

    public Wishlist addToWishlist(Long userId, Long productId) {
        // Validate user and product existence
        validateUser(userId);
        validateProduct(productId);

        // Check if product already exists in the wishlist
        if (wishlistRepository.findByUserIdAndProductId(userId, productId).isPresent()) {
            throw new IllegalArgumentException("Product already exists in the wishlist");
        }

        User user = userRepository.findById(userId).get();
        Product product = productRepository.findById(productId).get();

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        return wishlistRepository.save(wishlist);
    }

    public void removeFromWishlist(Long userId, Long productId) {
        // Validate user and product existence
        validateUser(userId);
        validateProduct(productId);

        Wishlist wishlist = wishlistRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new IllegalArgumentException("Wishlist item not found"));
        wishlistRepository.delete(wishlist);
    }

    private void validateUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }
    }

    private void validateProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Product not found");
        }
    }
}
