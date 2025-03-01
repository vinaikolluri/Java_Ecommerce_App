package com.example.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.dao.CategoryRepository;
import com.example.dao.ColourRepository;
import com.example.dao.OrderRepository;
import com.example.dao.ProductRepository;
import com.example.dao.SizeRepository;
import com.example.dao.SubCategpryRepository;
import com.example.dao.SurfaceFinishRepository;
import com.example.dao.ThicknessRepository;
import com.example.dto.ProductDTO;
import com.example.entity.Category;
import com.example.entity.Colour;
import com.example.entity.Order;
import com.example.entity.Product;
import com.example.entity.Size;
import com.example.entity.SubCategory;
import com.example.entity.SurfaceFinish;
import com.example.entity.Thickness;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SubCategpryRepository subCategoryRepository;
    
    @Autowired
    private CategoryRepository categoryrepo;
    @Autowired
    private ColourRepository colourRepo;
    @Autowired
    private SizeRepository sizerepo;
    @Autowired
    private ThicknessRepository thicknessRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private SurfaceFinishRepository surfaceFinishRepo;

    @Autowired
    private StorageServiceImpl storageService;

    // Add Product using ProductDTO
    public Product addProduct(ProductDTO productDTO, MultipartFile image1, MultipartFile image2, MultipartFile image3, MultipartFile video1) throws IOException {
        SubCategory subCategory = null;
        if (productDTO.getSubCategoryId() != null) {
            Optional<SubCategory> subCategoryOpt = subCategoryRepository.findById(productDTO.getSubCategoryId());
            if (subCategoryOpt.isEmpty()) {
                throw new IllegalArgumentException("SubCategory with ID " + productDTO.getSubCategoryId() + " not found.");
            }
            subCategory = subCategoryOpt.get();
        }

        Category category = null;
        if (productDTO.getCategoryId() != null) {
            Optional<Category> categoryOpt = categoryrepo.findById(productDTO.getCategoryId());
            if (categoryOpt.isEmpty()) {
                throw new IllegalArgumentException("Category with ID " + productDTO.getCategoryId() + " not found.");
            }
            category = categoryOpt.get();
        }

        Optional<Colour> colourOpt = colourRepo.findById(productDTO.getColorId());
        if (colourOpt.isEmpty()) {
            throw new IllegalArgumentException("Colour with ID " + productDTO.getColorId() + " not found.");
        }

        Optional<Size> sizeOpt = sizerepo.findById(productDTO.getSizeId());
        if (sizeOpt.isEmpty()) {
            throw new IllegalArgumentException("Size with ID " + productDTO.getSizeId() + " not found.");
        }

        Optional<Thickness> thicknessOpt = thicknessRepo.findById(productDTO.getThicknessId());
        if (thicknessOpt.isEmpty()) {
            throw new IllegalArgumentException("Thickness with ID " + productDTO.getThicknessId() + " not found.");
        }

        Optional<SurfaceFinish> surfaceFinishopt = surfaceFinishRepo.findById(productDTO.getSurfaceId());
        if (surfaceFinishopt.isEmpty()) {
            throw new IllegalArgumentException("SurfaceFinish with ID " + productDTO.getSurfaceId() + " not found.");
        }

        SurfaceFinish surfaceFinish = surfaceFinishopt.get();
        Colour colour = colourOpt.get();
        Size size = sizeOpt.get();
        Thickness thickness = thicknessOpt.get();

        Product product = mapProductDetails(productDTO, new Product());
        product.setSubCategory(subCategory); // Will remain null if no SubCategoryId is provided
        product.setCategory(category);
        product.setColour(colour);
        product.setSize(size);
        product.setThickness(thickness);
        product.setSurfaceFinish(surfaceFinish);

        // Save files using StorageServiceImpl and set file paths
        if (image1 != null) product.setImage1(storageService.store(image1));
        if (image2 != null) product.setImage2(storageService.store(image2));
        if (image3 != null) product.setImage3(storageService.store(image3));
        if (video1 != null) product.setVideo1(storageService.store(video1));

        return productRepository.save(product);
    }

    // Update Product using ProductDTO
    public Product updateProduct(Long id, ProductDTO productDTO, MultipartFile image1, MultipartFile image2, MultipartFile image3, MultipartFile video1) throws IOException {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            throw new IllegalArgumentException("Product with ID " + id + " not found.");
        }

        Product product = mapProductDetails(productDTO, productOpt.get());

        // Update subcategory if changed
        if (productDTO.getSubCategoryId() != null && !productDTO.getSubCategoryId().equals(product.getSubCategory().getId())) {
            Optional<SubCategory> subCategoryOpt = subCategoryRepository.findById(productDTO.getSubCategoryId());
            if (subCategoryOpt.isEmpty()) {
                throw new IllegalArgumentException("SubCategory with ID " + productDTO.getSubCategoryId() + " not found.");
            }
            product.setSubCategory(subCategoryOpt.get());
        }

        // Update category if changed
        if (productDTO.getCategoryId() != null && !productDTO.getCategoryId().equals(product.getCategory().getId())) {
            Optional<Category> categoryOpt = categoryrepo.findById(productDTO.getCategoryId());
            if (categoryOpt.isEmpty()) {
                throw new IllegalArgumentException("Category with ID " + productDTO.getCategoryId() + " not found.");
            }
            product.setCategory(categoryOpt.get());
        }

        // Update colour if changed
        if (productDTO.getColorId() != null && !productDTO.getColorId().equals(product.getColour().getId())) {
            Optional<Colour> colourOpt = colourRepo.findById(productDTO.getColorId());
            if (colourOpt.isEmpty()) {
                throw new IllegalArgumentException("Colour with ID " + productDTO.getColorId() + " not found.");
            }
            product.setColour(colourOpt.get());
        }

        // Update size if changed
        if (productDTO.getSizeId() != null && !productDTO.getSizeId().equals(product.getSize().getId())) {
            Optional<Size> sizeOpt = sizerepo.findById(productDTO.getSizeId());
            if (sizeOpt.isEmpty()) {
                throw new IllegalArgumentException("Size with ID " + productDTO.getSizeId() + " not found.");
            }
            product.setSize(sizeOpt.get());
        }

        // Update thickness if changed
        if (productDTO.getThicknessId() != null && !productDTO.getThicknessId().equals(product.getThickness().getId())) {
            Optional<Thickness> thicknessOpt = thicknessRepo.findById(productDTO.getThicknessId());
            if (thicknessOpt.isEmpty()) {
                throw new IllegalArgumentException("Thickness with ID " + productDTO.getThicknessId() + " not found.");
            }
            product.setThickness(thicknessOpt.get());
        }

        // Update surface finish if changed
        if (productDTO.getSurfaceId() != null && !productDTO.getSurfaceId().equals(product.getSurfaceFinish().getId())) {
            Optional<SurfaceFinish> surfaceFinishOpt = surfaceFinishRepo.findById(productDTO.getSurfaceId());
            if (surfaceFinishOpt.isEmpty()) {
                throw new IllegalArgumentException("SurfaceFinish with ID " + productDTO.getSurfaceId() + " not found.");
            }
            product.setSurfaceFinish(surfaceFinishOpt.get());
        }

        // Update files if provided
        if (image1 != null) product.setImage1(storageService.store(image1));  // Store using StorageServiceImpl
        if (image2 != null) product.setImage2(storageService.store(image2));  // Store using StorageServiceImpl
        if (image3 != null) product.setImage3(storageService.store(image3));  // Store using StorageServiceImpl
        if (video1 != null) product.setVideo1(storageService.store(video1));  // Store using StorageServiceImpl

        return productRepository.save(product);
    }

    // Delete Product by ID
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product with ID " + id + " not found.");
        }
        productRepository.deleteById(id);
    }

    // Map ProductDTO to Product entity
    private Product mapProductDetails(ProductDTO productDTO, Product product) {
        product.setProductName(productDTO.getProductName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setTotalQuantity(productDTO.getTotalQuantity());
        product.setMinQuantity(productDTO.getMinQuantity());
        
        product.setAvailableQuantity(productDTO.getAvailableQuantity());
        product.setPartialQuantity(productDTO.getPartialQuantity());
        product.setAvailability(productDTO.getAvailability());
        product.setOriginOfCountry(productDTO.getOriginOfCountry());
        product.setDeliveryFrom(productDTO.getDeliveryFrom());
        product.setInspection(productDTO.getInspection());
        product.setListedOn(productDTO.getListedOn());
        product.setEmi(productDTO.getEmi());
        product.setPayLater(productDTO.getPayLater());
        return product;
    }

    // Find a product by ID
    public Product findProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return product.get();
        } else {
            throw new IllegalArgumentException("Product not found with id: " + id);
        }
    }

    // Find all products
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    public void saveOrderDetails(Long buyerId, String deliveryAddress, double totalAmount) {
        Order order = new Order();
        order.setBuyerId(buyerId);
        order.setDeliveryAddress(deliveryAddress);
        order.setTotalAmount(totalAmount);
        order.setOrderStatus("PENDING"); // Default order status
        orderRepo.save(order);
    }

    public void updateOrderStatusToCompleted(Long buyerId, Long productId) {
        Order order = orderRepo.findByBuyerIdAndProductId(buyerId, productId);
        if (order != null) {
            order.setOrderStatus("Completed");
            orderRepo.save(order);
        }
    }
}