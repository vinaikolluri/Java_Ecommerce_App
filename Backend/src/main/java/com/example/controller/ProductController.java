package com.example.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.dto.ProductDTO;
import com.example.entity.Product;
import com.example.service.ProductService;
import com.example.service.StorageServiceImpl;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private StorageServiceImpl storageService;

    // Add a new product
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
            @ModelAttribute ProductDTO productDTO,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2,
            @RequestParam(value = "image3", required = false) MultipartFile image3,
            @RequestParam(value = "video1", required = false) MultipartFile video1) {
        try {
            // Add the product using the service with MultipartFiles directly
            Product product = productService.addProduct(productDTO, image1, image2, image3, video1);

            // Build a success response
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Product added successfully!",
                    "product", product
            ));
        } catch (Exception e) {
            // Build an error response
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Failed to add product.",
                    "error", e.getMessage()
            ));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @ModelAttribute ProductDTO productDTO,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2,
            @RequestParam(value = "image3", required = false) MultipartFile image3,
            @RequestParam(value = "video1", required = false) MultipartFile video1) {
        try {
            // Update the product using the service with MultipartFiles directly
            Product updatedProduct = productService.updateProduct(id, productDTO, image1, image2, image3, video1);

            // Build a success response
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Product updated successfully!",
                    "product", updatedProduct
            ));
        } catch (IllegalArgumentException e) {
            // Handle bad request errors
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Invalid request data.",
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            // Handle server-side errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to update product.",
                    "error", e.getMessage()
            ));
        }
    }

    // Delete product
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            // Perform the delete operation
            productService.deleteProduct(id);

            // Build a success response
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Product deleted successfully!",
                    "productId", id
            ));
        } catch (Exception e) {
            // Build an error response
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Error occurred while deleting the product.",
                    "error", e.getMessage()
            ));
        }
    }

    // Get a product by its ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.findProductById(id);
            // Log the file paths to verify
            System.out.println("Image 1: " + product.getImage1());
            System.out.println("Image 2: " + product.getImage2());
            System.out.println("Image 3: " + product.getImage3());
            System.out.println("Video 1: " + product.getVideo1());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Product retrieved successfully!",
                "product", product
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Failed to retrieve product.",
                "error", e.getMessage()
            ));
        }
    }

    // Get all products
    @GetMapping("/all")
    public ResponseEntity<?> getAllProducts() {
        try {
            // Fetch all products
            List<Product> products = productService.findAllProducts();
            // Build a success response
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Products retrieved successfully!",
                    "products", products
            ));
        } catch (Exception e) {
            // Handle server-side errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to retrieve products.",
                    "error", e.getMessage()
            ));
        }
    }

    // Get media file from S3
    @GetMapping("/media/{filename}")
    public ResponseEntity<?> getMedia(@PathVariable String filename) {
        try {
            // Retrieve the file URL from S3
            String fileUrl = storageService.load(filename);

            // Redirect to the file URL
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", fileUrl)
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Error occurred while retrieving the media file.",
                    "error", e.getMessage()
            ));
        }
    }
}