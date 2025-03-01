package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Cart;
import com.example.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

 // Add product to cart
    @PostMapping("/addProductToCart")
    public ResponseEntity<Cart> addProductToCart(@RequestParam Long productId, @RequestParam Long buyerId, @RequestParam Long quantity) {
        try {
            Cart cart = cartService.addProductToCart(productId, buyerId, quantity);
            return new ResponseEntity<>(cart, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Bad request when data is invalid
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Internal server error in case of unexpected failure
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update product quantity in cart
    @PutMapping("/updateCart/{cartId}")
    public ResponseEntity<Cart> updateCart(@PathVariable Long cartId, @RequestParam Long quantity) {
        try {
            Cart updatedCart = cartService.updateCart(cartId, quantity);
            return new ResponseEntity<>(updatedCart, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Bad request when data is invalid
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Internal server error
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete product from cart
    @DeleteMapping("/deleteCartItem/{cartId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable Long cartId) {
        try {
            cartService.deleteCartItem(cartId);
            return new ResponseEntity<>("Cart item deleted successfully.", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Bad request when cart item is not found
            return new ResponseEntity<>("Cart item does not exist.", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Internal server error
            return new ResponseEntity<>("Error deleting cart item.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Retrieve cart items by buyer ID
    @GetMapping("/findCartByBuyerId/{buyerId}")
    public ResponseEntity<List<Cart>> findCartByBuyerId(@PathVariable Long buyerId) {
        try {
            List<Cart> cartItems = cartService.findCartByBuyerId(buyerId);
            if (cartItems.isEmpty()) {
                return new ResponseEntity<>(cartItems, HttpStatus.NO_CONTENT); // No content if cart is empty
            }
            return new ResponseEntity<>(cartItems, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Bad request when buyer not found
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Internal server error
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
